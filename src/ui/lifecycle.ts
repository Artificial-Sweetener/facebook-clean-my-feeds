// SPDX-License-Identifier: GPL-3.0-only

/**
 * Own one mounted UI generation's external resources without global registries.
 * Disposing first marks callbacks inactive, then releases timers/listeners/observers exactly once.
 */
export class UiLifecycle {
  active = true;
  private readonly cleanups = new Set<() => void>();

  /** Register a teardown, or run it immediately when its generation already ended. */
  add(cleanup: (() => void) | undefined): void {
    if (!cleanup) return;
    if (this.active) this.cleanups.add(cleanup);
    else cleanup();
  }

  /** Remove an event listener at teardown and ignore already-queued stale dispatches. */
  listen(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void {
    /** Guard a dispatched event against a generation disposed before delivery. */
    const guarded = (event: Event): void => {
      if (this.active) listener(event);
    };
    target.addEventListener(type, guarded, options);
    this.add(() => target.removeEventListener(type, guarded, options));
  }

  /** Observe a node only while mounted; pending mutation records cannot reach a later generation. */
  observe(target: Node, options: MutationObserverInit, callback: MutationCallback): void {
    if (!this.active || typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver((records, instance) => {
      if (this.active) callback(records, instance);
    });
    observer.observe(target, options);
    this.add(() => observer.disconnect());
  }

  /** Schedule an owned timeout in milliseconds and release its cleanup record once it fires. */
  defer(callback: () => void, delay: number): void {
    if (!this.active) return;
    const id = setTimeout(() => {
      this.cleanups.delete(cancel);
      if (this.active) callback();
    }, delay);
    /** Cancel this generation's timeout before its callback can touch detached nodes. */
    const cancel = (): void => clearTimeout(id);
    this.add(cancel);
  }

  /** Coalesce caller-owned work into a cancellable frame, with a timeout fallback for limited hosts. */
  frame(callback: () => void): void {
    if (!this.active) return;
    if (typeof window.requestAnimationFrame !== "function") {
      this.defer(callback, 0);
      return;
    }
    let id: number | null = null;
    /** Cancel the animation frame if the browser has returned its request identifier. */
    const cancel = (): void => {
      if (id !== null) window.cancelAnimationFrame(id);
    };
    this.add(cancel);
    id = window.requestAnimationFrame(() => {
      this.cleanups.delete(cancel);
      if (this.active) callback();
    });
  }

  /** Tear down all owned resources once; one faulty host cleanup cannot retain the others. */
  dispose(): void {
    if (!this.active) return;
    this.active = false;
    for (const cleanup of this.cleanups) {
      try {
        cleanup();
      } catch {
        /* Continue releasing independent host resources. */
      }
    }
    this.cleanups.clear();
  }
}

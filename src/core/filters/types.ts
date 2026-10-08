// SPDX-License-Identifier: GPL-3.0-only

/** Materialized text filters share input order, case-sensitive and case-folded parallel arrays. */
export interface Filters {
  NF_BLOCKED_ENABLED: boolean;
  NF_BLOCKED_TEXT: string[];
  NF_BLOCKED_TEXT_LC: string[];
  GF_BLOCKED_ENABLED: boolean;
  GF_BLOCKED_TEXT: string[];
  GF_BLOCKED_TEXT_LC: string[];
  VF_BLOCKED_ENABLED: boolean;
  VF_BLOCKED_TEXT: string[];
  VF_BLOCKED_TEXT_LC: string[];
  MP_BLOCKED_ENABLED: boolean;
  MP_BLOCKED_TEXT: string[];
  MP_BLOCKED_TEXT_LC: string[];
  PP_BLOCKED_ENABLED: boolean;
  PP_BLOCKED_TEXT: string[];
  PP_BLOCKED_TEXT_LC: string[];
  MP_BLOCKED_TEXT_DESCRIPTION: string[];
  MP_BLOCKED_TEXT_DESCRIPTION_LC: string[];
}

/** Initial filter state is empty until the options boundary finishes hydration. */
export type PendingFilters = Partial<Filters>;

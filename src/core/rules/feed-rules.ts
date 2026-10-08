// SPDX-License-Identifier: GPL-3.0-only

/** Feed links used to recognize informational boxes independently of their translated labels. */
export const pathInfo = {
  OTHER_INFO_BOX_CORONAVIRUS: "/coronavirus_info/",
  OTHER_INFO_BOX_CLIMATE_SCIENCE: "/climatescienceinfo/",
  OTHER_INFO_BOX_SUBSCRIBE: "/support/",
};

/** Known informational-box routes supported by the pure classifier contract. */
export type PathInfo = typeof pathInfo;

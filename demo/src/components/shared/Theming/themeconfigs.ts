import moment from "moment";
import React from "react";

import BPAuthBackground from "../../../assets/bp/logos/bp-auth-background.png";
import BPAuthLogo from "../../../assets/bp/logos/bp-logo-light.png";
import DKBAuthBackground from "../../../assets/dkb/dkb-auth-background.png";
import DKBAuthLogo from "../../../assets/dkb/dkb-logo-dark.png";
import FHRAuthBackground from "../../../assets/fhr/fhr-auth-background.png";
import FHRAuthLogo from "../../../assets/fhr/fhr-logo-light.png";
import GrowmarkAuthBackground from "../../../assets/growmark/growmark-auth-background.jpg";
import GrowmarkAuthLogo from "../../../assets/growmark/growmark-logo-dark.png";
import MotivaAuthBackground from "../../../assets/motiva/motiva-auth-background.png";
import MotivaAuthLogo from "../../../assets/motiva/motiva-logo-dark.png";
import MurphyAuthBackground from "../../../assets/murphy/murphy-auth-background.png";
import MurphyAuthLogo from "../../../assets/murphy/murphy-logo-dark.png";
import OSPAuthBackground from "../../../assets/osp/logos/osp-auth-background.jpg";
import OSPAuthLogo from "../../../assets/osp/logos/osp-logo-dark.png";
import P66AuthBackground from "../../../assets/p66/p66-auth-background.png";
import P66AuthLogo from "../../../assets/p66/p66-logo-dark.png";
import PEAuthBackground from "../../../assets/pe/logos/sunoco-auth-background.png";
import PEAuthLogo from "../../../assets/pe/logos/sunoco-lp-logo-light.png";
import PoweredByOSP from "../../../assets/SiteImages/PoweredByLogos/PoweredByOSP.png";
import PoweredByPE from "../../../assets/SiteImages/PoweredByLogos/PoweredByPE.png";
import christmasLoginImage from "../../../assets/SiteImages/Themes/Christmas/christmas-tree.jpg";
import SunocoAuthBackground from "../../../assets/sunoco/logos/sunoco-auth-background.png";
import SunocoAuthLogo from "../../../assets/sunoco/logos/sunoco-lp-logo-dark.png";

export const themeConfigs = {
  LIGHT_MODE: {
    isFallback: true,
    display: "Light",
    key: "LIGHT_MODE",
    ThemeImportComponent: React.lazy(() => import("./Themes/Light/Light")),
    isDark: false,
    default: true,
  },
  DARK_MODE: {
    display: "Dark",
    key: "DARK_MODE",
    ThemeImportComponent: React.lazy(() => import("./Themes/Dark/Dark")),
    isDark: true,
  },
  SUNOCO: {
    display: "Sunoco",
    key: "SUNOCO",
    ThemeImportComponent: React.lazy(() => import("./Themes/Sunoco")),
    LoginBanner: SunocoAuthBackground,
    LoginLogo: SunocoAuthLogo,
    isDark: false,
    poweredByLogo: PoweredByOSP,
  },
  FHR: {
    display: "FHR",
    key: "FHR",
    ThemeImportComponent: React.lazy(() => import("./Themes/FHR")),
    LoginBanner: FHRAuthBackground,
    LoginLogo: FHRAuthLogo,
    isDark: false,
    poweredByLogo: PoweredByOSP,
  },
  MURPHY: {
    display: "Murphy",
    key: "MURPHY",
    ThemeImportComponent: React.lazy(() => import("./Themes/Murphy")),
    LoginBanner: MurphyAuthBackground,
    LoginLogo: MurphyAuthLogo,
    isDark: false,
    poweredByLogo: PoweredByOSP,
  },
  GROWMARK: {
    display: "Growmark",
    key: "GROWMARK",
    ThemeImportComponent: React.lazy(() => import("./Themes/Growmark")),
    LoginBanner: GrowmarkAuthBackground,
    LoginLogo: GrowmarkAuthLogo,
    isDark: false,
    poweredByLogo: PoweredByPE,
  },
  OSP: {
    display: "OSP",
    key: "OSP",
    ThemeImportComponent: React.lazy(() => import("./Themes/OSP")),
    LoginBanner: OSPAuthBackground,
    LoginLogo: OSPAuthLogo,
    isDark: false,
  },
  BP: {
    display: "BP",
    key: "BP",
    ThemeImportComponent: React.lazy(() => import("./Themes/BP")),
    LoginBanner: BPAuthBackground,
    LoginLogo: BPAuthLogo,
    isDark: false,
    poweredByLogo: PoweredByOSP,
  },
  DKB: {
    display: "DKB",
    key: "DKB",
    ThemeImportComponent: React.lazy(() => import("./Themes/DKB")),
    LoginBanner: DKBAuthBackground,
    LoginLogo: DKBAuthLogo,
    isDark: false,
    poweredByLogo: PoweredByOSP,
  },
  P66: {
    display: "P66",
    key: "P66",
    ThemeImportComponent: React.lazy(() => import("./Themes/P66")),
    LoginBanner: P66AuthBackground,
    LoginLogo: P66AuthLogo,
    isDark: false,
    poweredByLogo: PoweredByOSP,
  },
  PE_LIGHT: {
    display: "PE Light",
    key: "PE_LIGHT",
    ThemeImportComponent: React.lazy(() => import("./Themes/PE/Light")),
    LoginBanner: PEAuthBackground,
    LoginLogo: PEAuthLogo,
    isDark: false,
    poweredByLogo: PoweredByPE,
  },
  MOTIVA: {
    display: "Motiva",
    key: "MOTIVA",
    ThemeImportComponent: React.lazy(() => import("./Themes/Motiva")),
    LoginBanner: MotivaAuthBackground,
    LoginLogo: MotivaAuthLogo,
    isDark: false,
    isActive: true,
    poweredByLogo: PoweredByOSP,
  },
  THANKSGIVING: {
    display: "Thanksgiving",
    key: "THANKSGIVING",
    ThemeImportComponent: React.lazy(
      () => import("./Themes/Thanksgiving/Thanksgiving")
    ),
    isActive: () => moment().month() + 1 === 11,
    isDark: false,
  },
  CHRISTMAS: {
    display: "Christmas",
    key: "CHRISTMAS",
    ThemeImportComponent: React.lazy(
      () => import("./Themes/Christmas/Christmas")
    ),
    isActive: () => moment().month() + 1 === 12,
    isDark: false,
    LoginBanner: christmasLoginImage,
  },
} as const;

export type ThemeConfigs = typeof themeConfigs;
export type ThemeConfigDisplay = ThemeConfigs[keyof ThemeConfigs]["display"];

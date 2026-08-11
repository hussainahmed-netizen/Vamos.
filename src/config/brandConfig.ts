export interface LogoConfig {
  lightUrl: string;
  darkUrl: string;
  markUrl: string;
  altText: string;
}

export interface BrandConfig {
  brandName: string;
  brandTagline: string;
  shortName: string;
  domain: string;
  supportEmail: string;
  copyrightText: string;
  logo: LogoConfig;
}

export const initialBrandConfig: BrandConfig = {
  brandName: "Vamos",
  brandTagline: "Premium Storefront",
  shortName: "Vamos",
  domain: "vamosstore.com",
  supportEmail: "support@vamosstore.com",
  copyrightText: "© 2026 Vamos. All rights reserved.",
  logo: {
    lightUrl: "/logo.svg",
    darkUrl: "/logo-dark.svg",
    markUrl: "/favicon.svg",
    altText: "Vamos Logo",
  },
};

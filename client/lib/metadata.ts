import type { Metadata } from "next";

export const BASE_METADATA = {
  siteName: "Inideg",
  baseUrl: "http://localhost:3000.com",
  defaultDescription: "Discover and connect with  businesses.",
  defaultKeywords: [
    "business directory",
    "local businesses",
    "find services",
    "near me",
  ],
};

interface GenerateMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
}

export function generateMetadata({
  title,
  description = BASE_METADATA.defaultDescription,
  path = "/",
  keywords = BASE_METADATA.defaultKeywords,
}: GenerateMetadataOptions): Metadata {
  const fullTitle = `${title} | ${BASE_METADATA.siteName}`;
  const fullUrl = `${BASE_METADATA.baseUrl}${path}`;

  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: BASE_METADATA.siteName,
      type: "website",
    },
    // twitter: {
    //   card: "summary_large_image",
    //   title: fullTitle,
    //   description,
    //   creator: BASE_METADATA.twitterHandle,
    // },
  };
}

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://www.tessa.com.br";
    return [
        { url: `${base}/`, lastModified: new Date() },
        { url: `${base}/produtos`, lastModified: new Date() },
        { url: `${base}/servicos`, lastModified: new Date() },
        { url: `${base}/sobre`, lastModified: new Date() },
        { url: `${base}/contato`, lastModified: new Date() },
    ];
}
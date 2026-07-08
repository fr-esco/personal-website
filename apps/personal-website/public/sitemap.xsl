<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
    xmlns:html="http://www.w3.org/TR/REC-html40"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>XML Sitemap</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style type="text/css">
                    body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans,
        Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                    color: #333;
                    margin: 0;
                    padding: 2rem;
                    background: #f9fafb;
                    }
                    .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    h1 {
                    color: #111827;
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    }
                    p.desc {
                    color: #6b7280;
                    margin-bottom: 2rem;
                    font-size: 0.875rem;
                    }
                    table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.875rem;
                    }
                    th {
                    text-align: left;
                    padding: 0.75rem 1rem;
                    background-color: #f3f4f6;
                    color: #374151;
                    font-weight: 600;
                    border-bottom: 1px solid #e5e7eb;
                    }
                    td {
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid #e5e7eb;
                    color: #4b5563;
                    }
                    tr:hover td {
                    background-color: #f9fafb;
                    }
                    a {
                    color: #2563eb;
                    text-decoration: none;
                    }
                    a:hover {
                    text-decoration: underline;
                    }
                    .badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    background-color: #e5e7eb;
                    color: #374151;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>XML Sitemap</h1>
                    <p class="desc"> This is an XML Sitemap, meant for consumption by search engines
        like Google or Bing. You can find more information about XML sitemaps on <a
                            href="https://sitemaps.org">sitemaps.org</a>. </p>
                    <p class="desc"> This sitemap contains <xsl:value-of
                            select="count(sitemap:urlset/sitemap:url)" /> URLs. </p>
                    <table>
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>Priority</th>
                                <th>Frequency</th>
                                <th>Last Modified</th>
                                <th>Languages</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="sitemap:urlset/sitemap:url">
                                <tr>
                                    <td>
                                        <a href="{sitemap:loc}">
                                            <xsl:value-of select="sitemap:loc" />
                                        </a>
                                        <xsl:if test="image:image">
                                            <br />
                      <span style="font-size: 0.75rem; color: #6b7280;">
        🖼️ Image: <xsl:value-of select="image:image/image:loc" />
                                            </span>
                                        </xsl:if>
                                    </td>
                                    <td>
                                        <xsl:if test="sitemap:priority">
                                            <span class="badge">
                                                <xsl:value-of select="sitemap:priority" />
                                            </span>
                                        </xsl:if>
                                    </td>
                                    <td>
                                        <xsl:if test="sitemap:changefreq">
                                            <span class="badge"
                                                style="background-color: #dbeafe; color: #1e40af;">
                                                <xsl:value-of select="sitemap:changefreq" />
                                            </span>
                                        </xsl:if>
                                    </td>
                                    <td>
                                        <xsl:value-of
                                            select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)))" />
                                    </td>
                                    <td>
                                        <xsl:for-each select="xhtml:link">
                                            <div style="margin-bottom: 2px;">
                                                <span style="color: #9ca3af; margin-right: 4px;">
                                                    <xsl:value-of select="@hreflang" />: </span>
                                                <a href="{@href}" style="font-size: 0.75rem;">Link</a>
                                            </div>
                                        </xsl:for-each>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>

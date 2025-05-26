import React from 'react';
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import UrlBar from "../layouts/urlBar";
import Head from "next/head";
import { checkNotUndefined, replaceAdminUrl } from "../../utils/globalFunctions";
import { registeredPages } from "../../utils/constants";

const Template = ({
    children,
    urlBar = false,
    urlStrings = [],
    urlDetails = { title: "page", des: 'page desc' },
    currentPageData,
    slug = false,
    metaTags = true
}) => {

    let jsonLd = null;
    let slugConditionCheck = false;
    let headContent = null;
    if (metaTags) {
        jsonLd = replaceAdminUrl(slug ? currentPageData[slug].seo.jsonLd.raw : currentPageData.page.seo.jsonLd.raw);
        headContent = currentPageData.siteOption.siteOptions.head;

        slugConditionCheck = () => {
            return (slug === registeredPages.CASE_STUDY
                || slug === registeredPages.SINGLE_SERVICES
                || slug === registeredPages.CONSULTING_SERVICES
                || slug === registeredPages.SINGLE_INDUSTRY
                || slug === registeredPages.SINGLE_BLOG
            )
        }
    }

    return (
        <section className={"bg-black text-light"}>
            {
                metaTags && <Head>

                    <meta name='robots' content={(slug ? currentPageData[slug].seo.robots : currentPageData.page.seo.robots).join(',')} />
                    <link rel="icon" href={currentPageData.siteOption.siteOptions.favicon.mediaItemUrl} />

                    {
                        (slug === registeredPages.AUTHOR || slug === registeredPages.CATEGORY || slug === registeredPages.SINGLE_BLOG) ?
                            <>
                                <title>{currentPageData[slug].seo.openGraph.title}</title>
                                <meta name="description" content={currentPageData[slug].seo.openGraph.description} />
                            </>
                            :
                            <>
                                {slugConditionCheck() ?
                                    (slug !== registeredPages.AUTHOR || slug !== registeredPages.CATEGORY || slug !== registeredPages.SINGLE_BLOG) && <meta name="description" content={currentPageData[slug].seo.openGraph.description} />
                                    :
                                    <meta name="description" content={currentPageData.page.seo.openGraph.description} />
                                }
                                <title>{slug ? currentPageData[slug].seo.title : currentPageData.page.seo.openGraph.title}</title>

                            </>

                    }
                    <link rel="canonical" href={(slug ? currentPageData[slug].seo.canonicalUrl : currentPageData.page.seo.canonicalUrl).replace('/admin.', '/')} />

                    <meta property="og:title" content={slug ? currentPageData[slug].seo.openGraph.title : currentPageData.page.seo.openGraph.title} />
                    <meta property="og:site_name" content="Vikash Kumar Pal" />
                    <meta property="og:type" content="article" />
                    {
                        slugConditionCheck() ?
                            <meta property="og:description" content={currentPageData[slug].seo.description} />
                            :
                            <meta property="og:description" content={currentPageData.page.seo.description} />
                    }
                    {
                        slugConditionCheck() ?
                            <meta property="og:image" content={currentPageData[slug].featuredImage.node.mediaItemUrl} />

                            :
                            <meta property="og:image" content={currentPageData.page.featuredImage.node.mediaItemUrl} />

                    }
                    <meta property="og:url" content={(slug ? currentPageData[slug].seo.canonicalUrl : currentPageData.page.seo.canonicalUrl).replace('/admin.', '/')} />
                    <meta property="og:locale" content="en_US" />
                    <meta name='locale' content={(slug ? currentPageData[slug].seo.openGraph.locale : currentPageData.page.seo.openGraph.locale).replace('/admin.', '/')} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="@vikashkrpal" />
                    <meta name="twitter:url" content={(slug ? currentPageData[slug].seo.canonicalUrl : currentPageData.page.seo.canonicalUrl).replace('/admin.', '/')} />
                    <meta name="twitter:title" content={slug ? currentPageData[slug].seo.openGraph.title : currentPageData.page.seo.openGraph.title} />
                    <meta name="twitter:description" content={slug ? currentPageData[slug].seo.description : currentPageData.page.seo.description} />

                    {
                        slugConditionCheck() ?
                            <meta name="twitter:image" content={currentPageData[slug].featuredImage.node.mediaItemUrl} />
                            :
                            <meta name="twitter:image" content={currentPageData.page.featuredImage.node.mediaItemUrl} />


                    }

                    <meta name="twitter:label1" content="Written by" />

                    {
                        slugConditionCheck() ?
                            <meta name="twitter:data1" content={currentPageData[slug].author.node.name} />
                            :
                            <meta name="twitter:data1" content={currentPageData.page.author.node.name} />


                    }
                    <meta name="twitter:site" content="@vikashkrpal" />

                    {
                        slugConditionCheck() ?
                            <meta name="date" content={currentPageData[slug].dateGmt} />

                            :
                            <meta name="date" content={currentPageData.page.dateGmt} />

                    }

                    <meta name="last-modified" content={slug ? currentPageData[slug].seo.openGraph.updatedTime : currentPageData.page.seo.openGraph.updatedTime} />

                    <script type="application/ld+json" className="rank-math-schema" dangerouslySetInnerHTML={{ __html: (jsonLd.replace('<script type="application/ld+json" class="rank-math-schema">', '')).replace('</script>', '') }} />

                    {/* Google Tag Manager */}
                    {/* <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function(w, d, s, l, i) {
                                  w[l] = w[l] || [];
                                  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                                  var f = d.getElementsByTagName(s)[0],
                                      j = d.createElement(s),
                                      dl = l != 'dataLayer' ? '&l=' + l : '';
                                  j.async = true;
                                  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                                  f.parentNode.insertBefore(j, f);
                                })(window, document, 'script', 'dataLayer', 'GTM-NSPV8NBM');
                              `,
                        }}
                    /> */}

                    {!slug && ((currentPageData.page.title).toLowerCase() === registeredPages.HOMEPAGE) &&
                        <>
                            <meta name="google-site-verification" content="bk2kX3ZtF42LJ7x0Wrh9X8F_VpJHY1n0GrXesvaGl9o" />
                            <script type="application/ld+json"
                                dangerouslySetInnerHTML={{
                                    __html: `
                        {
                          "@context": "https://schema.org/",
                          "@type": "Person",
                          "name": "Vikash Kumar Pal",
                          "birthDate": "1999-07-25",
                          "gender":"Male",
                          "email": "mailto:hello@vikashkumarpal.com",
                          "nationality": {
                            "@type": "Country",
                            "name": "India"
                          },
                          "url": "https://vikashkumarpal.com/",
                          "image": "https://admin.vikashkumarpal.com/wp-content/uploads/2024/10/vikash-kumar-pal.webp",
                          "sameAs": [
                            "https://www.crunchbase.com/person/vikash-kumar-pal",
                            "https://www.facebook.com/imvikashkrpal/",
                            "https://www.instagram.com/vikashkrpal/",
                            "https://x.com/vikashkrpal",
                            "https://www.linkedin.com/in/vikashkrpal",
                            "https://www.pinterest.com/imvikashkrpal/"
                          ],
                        "alumniOf": [
                        {
                                 "@type": "CollegeOrUniversity",
                                 "name": "Guru Gobind Singh Indraprastha University",
                           "url":"http://www.ipu.ac.in/",
                                 "sameAs": "https://en.wikipedia.org/wiki/Guru_Gobind_Singh_Indraprastha_University"
                                },
                                {
                                 "@type": "CollegeOrUniversity",
                                 "name": "Delhi School of Professional Studies and Research",
                           "url":"https://dspsr.in/",
                                 "sameAs": "https://en.wikipedia.org/wiki/Delhi_School_of_Professional_Studies_and_Research"
                                }
                        ],
                          "jobTitle": "Co-founder and CEO",
                          "worksFor": {
                            "@type": "Organization",
                            "name": "improveFX",
                            "url":"https://improvefx.com/",
                             "sameAs": [
                            "https://www.crunchbase.com/organization/improvefx",
                            "https://www.linkedin.com/company/improvefx/"
                          ]
                          }  
                        }
                                                `
                                }}
                            />
                        </>}


                    <link rel="icon" type="image/x-icon" href="/icons/favicon.ico" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
                    <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
                    <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60x60.png" />
                    <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
                    <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
                    <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
                    <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
                    <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
                    <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
                    <link rel="apple-touch-icon" href="/icons/apple-icon.png" />
                    <link rel="apple-touch-icon-precomposed" href="/icons/apple-icon-precomposed.png" />
                    <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png" />
                    <meta name="msapplication-TileColor" content="#ffffff" />
                    <meta name="msapplication-square70x70logo" content="/icons/ms-icon-70x70.png" />
                    <meta name="msapplication-square150x150logo" content="/icons/ms-icon-150x150.png" />
                    <meta name="msapplication-wide310x150logo" content="/icons/ms-icon-310x310.png" />

                </Head>
            }


            {metaTags && checkNotUndefined(currentPageData.siteOption.siteOptions) && <div className={"body"} dangerouslySetInnerHTML={{ __html: currentPageData.siteOption.siteOptions.body }} />}

            <Header currentPageData={currentPageData} />
            <section className={"mobile-overflow-hidden"}>
                {urlBar && <UrlBar urlStrings={urlStrings} urlDetails={urlDetails} />}
                <div className="container">
                    {children}
                </div>
                <Footer currentPageData={currentPageData} />
            </section>
        </section>
    );
};

export default Template;


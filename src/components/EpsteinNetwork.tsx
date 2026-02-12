"use client";

import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

// ── Data from phelix001/epstein-network (focused_entities.json) ──
const RAW_NODES = [
  { id: "Jeffrey Epstein", count: 1508, category: "core", locations: {"Palm Beach":62,"Florida":51,"New York":49,"Miami":29,"Manhattan":5,"New Mexico":4,"St. Thomas":3,"London":2,"Paris":1}, years: {"1994":42,"1995":10,"1996":12,"1997":22,"2000":11,"2001":7,"2002":5,"2003":15,"2004":17,"2005":191,"2006":170,"2007":91,"2008":75,"2009":26,"2010":13,"2011":42,"2012":2,"2013":1,"2014":5,"2015":5,"2016":46,"2017":13,"2018":10,"2019":139,"2020":88,"2021":55,"2022":44,"2023":75,"2024":68,"2025":24} },
  { id: "Ghislaine Maxwell", count: 1193, category: "core", locations: {"New York":20,"Palm Beach":14,"Florida":11,"Miami":7,"New Mexico":4,"Manhattan":2,"London":2,"Paris":1}, years: {"1994":42,"1995":10,"1996":12,"1997":22,"2000":2,"2001":1,"2002":2,"2004":5,"2005":27,"2006":2,"2008":6,"2011":42,"2016":46,"2017":13,"2019":60,"2020":88,"2021":55,"2022":44,"2023":75,"2024":68} },
  { id: "Prince Andrew", count: 86, category: "political", locations: {"London":3,"New York":2,"Palm Beach":1}, years: {"2001":2,"2011":5,"2015":3,"2019":10,"2020":8,"2022":5,"2023":6,"2024":4} },
  { id: "Bill Clinton", count: 17, category: "political", locations: {"New York":2}, years: {"2002":2,"2003":3,"2005":1,"2019":4,"2020":2,"2023":2} },
  { id: "Donald Trump", count: 26, category: "political", locations: {"Palm Beach":3,"New York":2,"Florida":2}, years: {"1997":2,"2002":1,"2004":1,"2005":1,"2015":2,"2019":5,"2020":3,"2023":3,"2024":2} },
  { id: "Alan Dershowitz", count: 4, category: "legal", locations: {"Palm Beach":1,"Cambridge":1}, years: {"2005":1,"2014":2,"2015":3,"2019":5,"2024":2} },
  { id: "Virginia Giuffre", count: 1, category: "victim", locations: {"Palm Beach":2,"London":1,"New York":1}, years: {"2001":3,"2005":2,"2008":1,"2014":5,"2015":10,"2019":8,"2022":4} },
  { id: "Jean-Luc Brunel", count: 6, category: "accomplice", locations: {"Paris":3,"New York":2,"Miami":1}, years: {"1997":2,"2002":1,"2005":2,"2019":3,"2020":2,"2022":1} },
  { id: "Sarah Kellen", count: 1, category: "accomplice", locations: {"New York":1,"Miami":1}, years: {"2004":1,"2006":1,"2008":6,"2016":5,"2017":2} },
  { id: "Lesley Groff", count: 1, category: "accomplice", locations: {"New York":1}, years: {"2005":2,"2008":3,"2016":2} },
  { id: "Mark Epstein", count: 51, category: "family", locations: {"New York":3,"Palm Beach":1}, years: {"2005":3,"2008":2,"2019":5,"2020":4,"2025":2} },
  { id: "Isabel Maxwell", count: 16, category: "family", locations: {"New York":1,"London":1}, years: {"2020":3,"2021":4,"2022":2} },
  { id: "Deutsche Bank", count: 42, category: "financial", locations: {"New York":5}, years: {"2013":2,"2019":8,"2020":15,"2022":5,"2023":4} },
  { id: "Glenn Dubin", count: 3, category: "business", locations: {"New York":2}, years: {"2002":1,"2005":1,"2019":2} },
  { id: "Leon Black", count: 22, category: "business", locations: {"New York":3}, years: {"2019":5,"2020":4,"2021":8,"2023":2} },
  { id: "Les Wexner", count: 8, category: "business", locations: {"Columbus":2,"New York":1}, years: {"1998":2,"2002":1,"2005":2,"2019":5} },
  { id: "Joi Ito", count: 8, category: "academic", locations: {"Cambridge":2}, years: {"2013":2,"2019":5} },
  { id: "David Copperfield", count: 1, category: "entertainment", locations: {"Las Vegas":1}, years: {"2005":1,"2019":1} },
  { id: "Naomi Campbell", count: 1, category: "entertainment", locations: {"New York":1,"London":1}, years: {"2001":1,"2019":1} },
  { id: "Christian Everdell", count: 295, category: "legal", locations: {"New York":8}, years: {"2020":40,"2021":55,"2022":44} },
  { id: "Laura Menninger", count: 278, category: "legal", locations: {"New York":6}, years: {"2020":35,"2021":50,"2022":40} },
  { id: "Jeff Pagliuca", count: 203, category: "legal", locations: {"New York":5}, years: {"2020":30,"2021":40} },
  { id: "Bobbi Sternheim", count: 149, category: "legal", locations: {"New York":4}, years: {"2020":20,"2021":30} },
  { id: "Gloria Allred", count: 61, category: "legal", locations: {"Los Angeles":3,"New York":2}, years: {"2008":2,"2019":8,"2020":5} },
  { id: "Brad Edwards", count: 31, category: "legal", locations: {"Palm Beach":2,"Florida":2}, years: {"2008":5,"2014":3,"2019":4} },
  { id: "Sigrid McCawley", count: 31, category: "legal", locations: {"New York":3}, years: {"2015":4,"2019":5,"2020":3} },
  { id: "Roberta Kaplan", count: 32, category: "legal", locations: {"New York":4}, years: {"2019":3,"2020":4,"2022":3} },
  { id: "Alexander Acosta", count: 6, category: "legal", locations: {"Miami":2,"Palm Beach":2}, years: {"2007":3,"2008":2,"2019":5} },
  { id: "Robert Mueller", count: 19, category: "legal", locations: {"Washington":3}, years: {"2007":2,"2019":5,"2020":3} },
  { id: "Joe Biden", count: 19, category: "political", locations: {"Washington":2}, years: {"2019":3,"2020":2,"2023":5,"2024":4} },
  { id: "Julie K. Brown", count: 4, category: "journalist", locations: {"Miami":2}, years: {"2018":3,"2019":5} },
  { id: "Ken Starr", count: 4, category: "legal", locations: {"Washington":1}, years: {"2007":2,"2008":1} },
  { id: "Judge Berman", count: 33, category: "legal", locations: {"New York":5}, years: {"2019":15,"2020":5} },
  { id: "Alison Nathan", count: 35, category: "legal", locations: {"New York":5}, years: {"2021":20,"2022":10} },
  { id: "Jack Scarola", count: 43, category: "legal", locations: {"Palm Beach":3}, years: {"2008":3,"2019":4} },
  { id: "Martin Weinberg", count: 39, category: "legal", locations: {"New York":3}, years: {"2019":8,"2020":5} },
  { id: "Reid Weingarten", count: 39, category: "legal", locations: {"Washington":2,"New York":2}, years: {"2019":6} },
  { id: "Mark Cohen", count: 75, category: "legal", locations: {"New York":5}, years: {"2019":10,"2020":8} },
  { id: "Audrey Strauss", count: 25, category: "legal", locations: {"New York":4}, years: {"2020":10,"2021":5} },
  { id: "David Boies", count: 29, category: "legal", locations: {"New York":3}, years: {"2014":2,"2015":3,"2019":5} },
  { id: "Paul Cassell", count: 16, category: "legal", locations: {"Utah":1}, years: {"2008":3,"2014":2} },
  { id: "Barry Krischer", count: 1, category: "legal", locations: {"Palm Beach":2}, years: {"2006":3,"2007":2} },
  { id: "Stan Pottinger", count: 1, category: "associate", locations: {"New York":1}, years: {"2019":1} },
  { id: "Juanesteban Ganoza", count: 1, category: "associate", locations: {}, years: {"2020":1} },
  { id: "Roy Black", count: 2, category: "legal", locations: {"Miami":2}, years: {"2006":2,"2007":1} },
  { id: "Jay Lefkowitz", count: 3, category: "legal", locations: {"New York":1,"Washington":1}, years: {"2007":2,"2008":1} },
  { id: "Geoffrey Berman", count: 22, category: "legal", locations: {"New York":4}, years: {"2019":10,"2020":5} },
];

const RAW_EDGES = [
  { source: "Jeffrey Epstein", target: "Ghislaine Maxwell", weight: 27 },
  { source: "Jeffrey Epstein", target: "Deutsche Bank", weight: 42 },
  { source: "Jeffrey Epstein", target: "Mark Epstein", weight: 10 },
  { source: "Jeffrey Epstein", target: "Martin Weinberg", weight: 10 },
  { source: "Jeffrey Epstein", target: "Reid Weingarten", weight: 10 },
  { source: "Jeffrey Epstein", target: "Mark Cohen", weight: 10 },
  { source: "Jeffrey Epstein", target: "Stan Pottinger", weight: 10 },
  { source: "Jeffrey Epstein", target: "Prince Andrew", weight: 5 },
  { source: "Jeffrey Epstein", target: "Bill Clinton", weight: 3 },
  { source: "Jeffrey Epstein", target: "Donald Trump", weight: 3 },
  { source: "Jeffrey Epstein", target: "Alan Dershowitz", weight: 4 },
  { source: "Jeffrey Epstein", target: "Virginia Giuffre", weight: 5 },
  { source: "Jeffrey Epstein", target: "Jean-Luc Brunel", weight: 5 },
  { source: "Jeffrey Epstein", target: "Sarah Kellen", weight: 3 },
  { source: "Jeffrey Epstein", target: "Lesley Groff", weight: 3 },
  { source: "Jeffrey Epstein", target: "Glenn Dubin", weight: 3 },
  { source: "Jeffrey Epstein", target: "Leon Black", weight: 4 },
  { source: "Jeffrey Epstein", target: "Les Wexner", weight: 5 },
  { source: "Jeffrey Epstein", target: "Joi Ito", weight: 3 },
  { source: "Jeffrey Epstein", target: "David Copperfield", weight: 1 },
  { source: "Jeffrey Epstein", target: "Naomi Campbell", weight: 1 },
  { source: "Jeffrey Epstein", target: "Gloria Allred", weight: 5 },
  { source: "Jeffrey Epstein", target: "Brad Edwards", weight: 5 },
  { source: "Jeffrey Epstein", target: "Sigrid McCawley", weight: 5 },
  { source: "Jeffrey Epstein", target: "Alexander Acosta", weight: 4 },
  { source: "Jeffrey Epstein", target: "Robert Mueller", weight: 3 },
  { source: "Jeffrey Epstein", target: "Julie K. Brown", weight: 3 },
  { source: "Jeffrey Epstein", target: "Ken Starr", weight: 3 },
  { source: "Jeffrey Epstein", target: "Judge Berman", weight: 5 },
  { source: "Jeffrey Epstein", target: "Jack Scarola", weight: 5 },
  { source: "Jeffrey Epstein", target: "David Boies", weight: 3 },
  { source: "Jeffrey Epstein", target: "Barry Krischer", weight: 2 },
  { source: "Jeffrey Epstein", target: "Roy Black", weight: 2 },
  { source: "Jeffrey Epstein", target: "Jay Lefkowitz", weight: 2 },
  { source: "Jeffrey Epstein", target: "Geoffrey Berman", weight: 5 },
  { source: "Jeffrey Epstein", target: "Joe Biden", weight: 1 },
  { source: "Jeffrey Epstein", target: "Audrey Strauss", weight: 3 },
  { source: "Jeffrey Epstein", target: "Alison Nathan", weight: 3 },
  { source: "Ghislaine Maxwell", target: "Isabel Maxwell", weight: 10 },
  { source: "Ghislaine Maxwell", target: "Christian Everdell", weight: 10 },
  { source: "Ghislaine Maxwell", target: "Laura Menninger", weight: 10 },
  { source: "Ghislaine Maxwell", target: "Jeff Pagliuca", weight: 10 },
  { source: "Ghislaine Maxwell", target: "Bobbi Sternheim", weight: 10 },
  { source: "Ghislaine Maxwell", target: "Juanesteban Ganoza", weight: 10 },
  { source: "Ghislaine Maxwell", target: "Prince Andrew", weight: 5 },
  { source: "Ghislaine Maxwell", target: "Virginia Giuffre", weight: 5 },
  { source: "Ghislaine Maxwell", target: "Jean-Luc Brunel", weight: 4 },
  { source: "Ghislaine Maxwell", target: "Sarah Kellen", weight: 3 },
  { source: "Ghislaine Maxwell", target: "Lesley Groff", weight: 3 },
  { source: "Ghislaine Maxwell", target: "Gloria Allred", weight: 5 },
  { source: "Ghislaine Maxwell", target: "Sigrid McCawley", weight: 5 },
  { source: "Ghislaine Maxwell", target: "Alison Nathan", weight: 5 },
  { source: "Ghislaine Maxwell", target: "Roberta Kaplan", weight: 3 },
  { source: "Ghislaine Maxwell", target: "Audrey Strauss", weight: 3 },
  { source: "Ghislaine Maxwell", target: "Naomi Campbell", weight: 1 },
  { source: "Ghislaine Maxwell", target: "David Boies", weight: 2 },
  { source: "Ghislaine Maxwell", target: "Donald Trump", weight: 2 },
  { source: "Ghislaine Maxwell", target: "Bill Clinton", weight: 2 },
  { source: "Christian Everdell", target: "Laura Menninger", weight: 5 },
  { source: "Christian Everdell", target: "Jeff Pagliuca", weight: 5 },
  { source: "Christian Everdell", target: "Bobbi Sternheim", weight: 5 },
  { source: "Laura Menninger", target: "Jeff Pagliuca", weight: 5 },
  { source: "Laura Menninger", target: "Bobbi Sternheim", weight: 5 },
  { source: "Jeff Pagliuca", target: "Bobbi Sternheim", weight: 5 },
  { source: "Gloria Allred", target: "Virginia Giuffre", weight: 5 },
  { source: "Jack Scarola", target: "Virginia Giuffre", weight: 5 },
  { source: "Jack Scarola", target: "Brad Edwards", weight: 5 },
  { source: "Brad Edwards", target: "Virginia Giuffre", weight: 5 },
  { source: "Brad Edwards", target: "Paul Cassell", weight: 5 },
  { source: "Sigrid McCawley", target: "Virginia Giuffre", weight: 5 },
  { source: "Sigrid McCawley", target: "David Boies", weight: 3 },
  { source: "Virginia Giuffre", target: "Prince Andrew", weight: 5 },
  { source: "Virginia Giuffre", target: "Alan Dershowitz", weight: 4 },
  { source: "Virginia Giuffre", target: "Jean-Luc Brunel", weight: 3 },
  { source: "Virginia Giuffre", target: "Sarah Kellen", weight: 3 },
  { source: "Virginia Giuffre", target: "David Boies", weight: 3 },
  { source: "Prince Andrew", target: "Alan Dershowitz", weight: 2 },
  { source: "Donald Trump", target: "Sarah Kellen", weight: 1 },
  { source: "Bill Clinton", target: "Sarah Kellen", weight: 1 },
  { source: "Jean-Luc Brunel", target: "Sarah Kellen", weight: 2 },
  { source: "Jean-Luc Brunel", target: "Naomi Campbell", weight: 1 },
  { source: "Alexander Acosta", target: "Barry Krischer", weight: 3 },
  { source: "Alexander Acosta", target: "Jay Lefkowitz", weight: 2 },
  { source: "Alexander Acosta", target: "Robert Mueller", weight: 2 },
  { source: "Julie K. Brown", target: "Alexander Acosta", weight: 2 },
  { source: "Julie K. Brown", target: "Brad Edwards", weight: 2 },
  { source: "Ken Starr", target: "Jay Lefkowitz", weight: 2 },
  { source: "Ken Starr", target: "Alexander Acosta", weight: 1 },
  { source: "Leon Black", target: "David Boies", weight: 2 },
  { source: "Les Wexner", target: "Leon Black", weight: 1 },
  { source: "Mark Epstein", target: "Isabel Maxwell", weight: 1 },
  { source: "Judge Berman", target: "Martin Weinberg", weight: 3 },
  { source: "Judge Berman", target: "Reid Weingarten", weight: 3 },
  { source: "Judge Berman", target: "Geoffrey Berman", weight: 2 },
  { source: "Alison Nathan", target: "Audrey Strauss", weight: 3 },
  { source: "Roberta Kaplan", target: "David Boies", weight: 2 },
  { source: "Geoffrey Berman", target: "Audrey Strauss", weight: 4 },
  { source: "Geoffrey Berman", target: "Robert Mueller", weight: 2 },
  { source: "Lesley Groff", target: "Sarah Kellen", weight: 3 },
  { source: "Paul Cassell", target: "Jack Scarola", weight: 3 },
  { source: "Joi Ito", target: "Leon Black", weight: 1 },
  { source: "Martin Weinberg", target: "Reid Weingarten", weight: 3 },
  { source: "Martin Weinberg", target: "Mark Cohen", weight: 2 },
  { source: "Reid Weingarten", target: "Mark Cohen", weight: 2 },
  { source: "Joe Biden", target: "Donald Trump", weight: 1 },
  { source: "Joe Biden", target: "Robert Mueller", weight: 1 },
  { source: "Glenn Dubin", target: "Leon Black", weight: 1 },
  { source: "Roberta Kaplan", target: "Virginia Giuffre", weight: 2 },
  { source: "Roy Black", target: "Barry Krischer", weight: 2 },
  { source: "Roy Black", target: "Alexander Acosta", weight: 1 },
  { source: "David Copperfield", target: "Jean-Luc Brunel", weight: 1 },
  { source: "Mark Cohen", target: "Judge Berman", weight: 2 },
];

// Anduril-inspired color palette
const COLORS = {
  bg: "#000000",
  bgAlt: "#0a0a0a",
  border: "#1a1a1a",
  text: "#ffffff",
  textMuted: "#bdad96",
  textDim: "#666666",
  accent: "#dff140",
  error: "#ff3535",
  offWhite: "#f1f0ea",
};

const CATEGORY_COLORS: Record<string, string> = {
  core: "#ff3535",
  accomplice: "#ff6b35",
  victim: "#dff140",
  political: "#4a9eff",
  business: "#50c878",
  financial: "#ffd700",
  legal: "#bdad96",
  academic: "#da70d6",
  entertainment: "#ff69b4",
  journalist: "#87ceeb",
  family: "#cd853f",
  associate: "#808080",
};

const CATEGORY_LABELS: Record<string, string> = {
  core: "Core Subject",
  accomplice: "Accomplice",
  victim: "Victim/Survivor",
  political: "Political Figure",
  business: "Business/Finance",
  financial: "Financial Institution",
  legal: "Legal/Law Enforcement",
  academic: "Academic",
  entertainment: "Entertainment",
  journalist: "Journalist",
  family: "Family",
  associate: "Associate",
};

// No external photos - using initials only to avoid CORS issues

// Summaries and Epstein connections
const SUMMARIES: Record<string, { summary: string; connection: string }> = {
  "Jeffrey Epstein": {
    summary: "American financier and convicted sex offender. Arrested in 2019 on federal charges of sex trafficking minors. Died in custody in August 2019.",
    connection: "Central figure in the network. Operated a sex trafficking ring involving minors across multiple locations including Manhattan, Palm Beach, and the U.S. Virgin Islands."
  },
  "Ghislaine Maxwell": {
    summary: "British socialite and convicted sex offender. Daughter of media proprietor Robert Maxwell.",
    connection: "Epstein's longtime associate and girlfriend. Convicted in 2021 of recruiting and grooming underage girls for Epstein. Currently serving 20-year federal prison sentence."
  },
  "Prince Andrew": {
    summary: "Duke of York, member of the British Royal Family. Third child of Queen Elizabeth II.",
    connection: "Accused by Virginia Giuffre of sexual abuse when she was 17. Photographed with Giuffre at Maxwell's London home. Settled civil lawsuit in 2022 for undisclosed sum. Stripped of military titles and royal patronages."
  },
  "Bill Clinton": {
    summary: "42nd President of the United States (1993-2001).",
    connection: "Flight logs show Clinton flew on Epstein's private jet multiple times. Clinton's office acknowledged he took trips on the aircraft for foundation work but denied knowledge of any crimes."
  },
  "Donald Trump": {
    summary: "45th President of the United States (2017-2021). Real estate developer.",
    connection: "Longtime acquaintance in Palm Beach social circles. Famous 2002 quote calling Epstein 'terrific guy' who 'likes beautiful women...on the younger side.' Later banned Epstein from Mar-a-Lago, reportedly over incident with member's daughter."
  },
  "Alan Dershowitz": {
    summary: "Harvard Law professor emeritus. High-profile defense attorney.",
    connection: "Part of Epstein's legal defense team in 2008. Accused by Virginia Giuffre of sexual abuse, which he has repeatedly denied. Engaged in public legal battles over the accusations."
  },
  "Virginia Giuffre": {
    summary: "Sex trafficking survivor and advocate. Key witness in Epstein case.",
    connection: "Recruited by Maxwell at age 16 while working at Mar-a-Lago. Alleges she was trafficked to Epstein's associates. Filed lawsuits against Maxwell, Prince Andrew, and Dershowitz. Central witness in multiple prosecutions."
  },
  "Jean-Luc Brunel": {
    summary: "French modeling agent. Founder of MC2 modeling agency.",
    connection: "Accused of supplying girls to Epstein through his modeling agencies. Found dead in Paris prison cell in 2022 while awaiting trial on rape and sexual assault charges."
  },
  "Sarah Kellen": {
    summary: "Former Epstein assistant.",
    connection: "Named as potential co-conspirator in 2007 non-prosecution agreement. Identified by victims as key scheduler of 'massages.' Received immunity in 2008 plea deal. Later named in civil lawsuits."
  },
  "Lesley Groff": {
    summary: "Former Epstein executive assistant.",
    connection: "Longtime assistant who managed Epstein's complex schedule. Named in court documents as helping facilitate trafficking. Identified in multiple victim testimonies."
  },
  "Mark Epstein": {
    summary: "Jeffrey Epstein's brother. Real estate developer.",
    connection: "Family member with knowledge of Jeffrey's properties and activities. Testified about his brother's lifestyle and associations. Owner of properties used in trafficking operations."
  },
  "Isabel Maxwell": {
    summary: "British-American technology entrepreneur. Ghislaine Maxwell's sister.",
    connection: "Sister who maintained contact during legal proceedings. Family connection to Maxwell defense."
  },
  "Deutsche Bank": {
    summary: "German multinational investment bank.",
    connection: "Maintained Epstein's accounts from 2013-2018, processing hundreds of transactions. Fined $150 million by NY regulators in 2020 for compliance failures related to Epstein accounts."
  },
  "Glenn Dubin": {
    summary: "Billionaire hedge fund manager. Co-founder of Highbridge Capital.",
    connection: "Longtime friend of Epstein. Virginia Giuffre alleged she was directed to have sexual encounters with Dubin, which he denies. His wife was former Miss Sweden linked to Epstein."
  },
  "Leon Black": {
    summary: "Billionaire investor. Co-founder of Apollo Global Management.",
    connection: "Paid Epstein $158 million for financial advice and tax services between 2012-2017. Stepped down as Apollo CEO in 2021 amid scrutiny of the relationship."
  },
  "Les Wexner": {
    summary: "Billionaire retail executive. Founder of L Brands (Victoria's Secret).",
    connection: "Epstein's most significant financial relationship. Gave Epstein power of attorney and $46M Manhattan mansion. Severed ties in 2007, calling Epstein's conduct 'abhorrent.'"
  },
  "Joi Ito": {
    summary: "Former Director of MIT Media Lab. Technology investor.",
    connection: "Accepted donations from Epstein for MIT after Epstein's 2008 conviction. Resigned in 2019 when extent of relationship was revealed. Emails showed efforts to conceal Epstein's involvement."
  },
  "David Copperfield": {
    summary: "World-famous illusionist and magician.",
    connection: "Named in court documents as having been on Epstein's private island. Met Epstein through social circles. No allegations of wrongdoing."
  },
  "Naomi Campbell": {
    summary: "British supermodel and businesswoman.",
    connection: "Attended events with Epstein and Maxwell. Appeared in Epstein's 'black book' of contacts. No allegations of wrongdoing."
  },
  "Christian Everdell": {
    summary: "Federal prosecutor, Assistant U.S. Attorney for SDNY.",
    connection: "Lead prosecutor in Ghislaine Maxwell trial. Successfully convicted Maxwell on five of six counts in December 2021."
  },
  "Laura Menninger": {
    summary: "Defense attorney specializing in white-collar crime.",
    connection: "Lead defense counsel for Ghislaine Maxwell. Argued Maxwell was scapegoat for Epstein's crimes."
  },
  "Gloria Allred": {
    summary: "High-profile victims' rights attorney.",
    connection: "Represented multiple Epstein victims in civil proceedings and public advocacy."
  },
  "Brad Edwards": {
    summary: "Attorney specializing in sexual abuse cases.",
    connection: "Represented dozens of Epstein victims since 2008. Instrumental in bringing case back to public attention. Co-author of 'Relentless Pursuit' about the case."
  },
  "Alexander Acosta": {
    summary: "Former U.S. Secretary of Labor. Former U.S. Attorney for Southern Florida.",
    connection: "Negotiated controversial 2008 plea deal giving Epstein just 13 months in county jail with work release. Resigned from Trump cabinet in 2019 amid criticism of the deal."
  },
  "Robert Mueller": {
    summary: "Former FBI Director. Special Counsel for Russia investigation.",
    connection: "FBI Director during initial Epstein investigation. Bureau's handling of case has been questioned. No direct involvement alleged."
  },
  "Joe Biden": {
    summary: "46th President of the United States.",
    connection: "No direct connection to Epstein. Mentioned in context of political figures commenting on the case and prosecution."
  },
  "Julie K. Brown": {
    summary: "Investigative journalist at Miami Herald.",
    connection: "Her 2018 'Perversion of Justice' series reignited public interest in Epstein case, leading to his 2019 arrest. Exposed failures of 2008 plea deal."
  },
  "Ken Starr": {
    summary: "Former U.S. Solicitor General. Led Clinton impeachment investigation.",
    connection: "Part of Epstein's legal team that negotiated 2008 plea deal. Helped secure lenient non-prosecution agreement."
  },
  "Judge Berman": {
    summary: "U.S. District Judge, Southern District of New York.",
    connection: "Presided over Epstein's 2019 federal case. Denied bail, citing flight risk and danger to community. Dismissed case after Epstein's death."
  },
  "Alison Nathan": {
    summary: "U.S. District Judge, Southern District of New York.",
    connection: "Presided over Ghislaine Maxwell trial. Sentenced Maxwell to 20 years in prison in June 2022."
  },
  "Geoffrey Berman": {
    summary: "Former U.S. Attorney for Southern District of New York.",
    connection: "Oversaw 2019 Epstein prosecution. Announced charges against Epstein and later Maxwell. Pushed forward with case despite DOJ pressure."
  },
  "Audrey Strauss": {
    summary: "Former Acting U.S. Attorney for SDNY.",
    connection: "Announced Ghislaine Maxwell's arrest in July 2020. Oversaw prosecution team."
  },
  "David Boies": {
    summary: "Prominent trial lawyer. Chairman of Boies Schiller Flexner.",
    connection: "Represented Epstein victims including Virginia Giuffre. Also previously worked for Harvey Weinstein, creating conflict of interest controversy."
  },
  "Barry Krischer": {
    summary: "Former Palm Beach County State Attorney.",
    connection: "Initially investigated Epstein in 2005-2006. Referred case to federal prosecutors, leading to criticized plea deal. Grand jury proceedings remain sealed."
  },
};

interface NodeData {
  id: string;
  count: number;
  category: string;
  locations: Record<string, number>;
  years: Record<string, number>;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface EdgeData {
  source: string | NodeData;
  target: string | NodeData;
  weight: number;
}

export default function EpsteinNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(Object.keys(CATEGORY_COLORS)));
  const [searchTerm, setSearchTerm] = useState("");
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [zoomLevel, setZoomLevel] = useState(1);

  const maxCount = Math.max(...RAW_NODES.map(n => n.count));
  const radiusScale = d3.scaleSqrt().domain([1, maxCount]).range([8, 60]);
  const maxWeight = Math.max(...RAW_EDGES.map(e => e.weight));

  useEffect(() => {
    const updateDim = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateDim();
    window.addEventListener("resize", updateDim);
    return () => window.removeEventListener("resize", updateDim);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !dimensions.width) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    const filteredNodeIds = new Set(
      RAW_NODES
        .filter(n => activeCategories.has(n.category))
        .filter(n => !searchTerm || n.id.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(n => n.id)
    );
    const nodes: NodeData[] = RAW_NODES.filter(n => filteredNodeIds.has(n.id)).map(n => ({ ...n }));
    const edges: EdgeData[] = RAW_EDGES
      .filter(e => filteredNodeIds.has(e.source as string) && filteredNodeIds.has(e.target as string))
      .map(e => ({ ...e }));

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    const g = svg.append("g");
    const defs = svg.append("defs");

    // Glow filter
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Draw edges
    const link = g.append("g")
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke", COLORS.border)
      .attr("stroke-opacity", d => 0.2 + (d.weight / maxWeight) * 0.6)
      .attr("stroke-width", d => 0.5 + (d.weight / maxWeight) * 3);

    // Draw nodes
    const node = g.append("g")
      .selectAll<SVGGElement, NodeData>("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer");

    // Border circle
    node.append("circle")
      .attr("r", d => radiusScale(d.count) + 2)
      .attr("fill", "none")
      .attr("stroke", d => CATEGORY_COLORS[d.category] || COLORS.textMuted)
      .attr("stroke-width", 2)
      .attr("filter", d => d.count > 50 ? "url(#glow)" : null);

    // Filled circle with initial
    node.append("circle")
      .attr("r", d => radiusScale(d.count))
      .attr("fill", d => CATEGORY_COLORS[d.category] || COLORS.textDim)
      .attr("fill-opacity", 0.9);

    node.append("text")
      .text(d => d.id.charAt(0))
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", COLORS.text)
      .attr("font-size", d => `${Math.max(10, radiusScale(d.count) * 0.6)}px`)
      .attr("font-family", "Helvetica, Arial, sans-serif")
      .attr("font-weight", "500");

    // Labels
    node.append("text")
      .text(d => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", d => radiusScale(d.count) + 16)
      .attr("fill", COLORS.text)
      .attr("font-size", d => d.count > 500 ? "12px" : d.count > 50 ? "10px" : "9px")
      .attr("font-family", "Helvetica, Arial, sans-serif")
      .attr("font-weight", d => d.count > 100 ? "500" : "400")
      .attr("letter-spacing", "-0.02em")
      .attr("paint-order", "stroke")
      .attr("stroke", COLORS.bg)
      .attr("stroke-width", "3px");

    // Build connection map
    const connectionMap = new Map<string, Set<string>>();
    nodes.forEach(n => connectionMap.set(n.id, new Set([n.id])));
    edges.forEach(e => {
      const s = typeof e.source === 'object' ? (e.source as NodeData).id : e.source;
      const t = typeof e.target === 'object' ? (e.target as NodeData).id : e.target;
      connectionMap.get(s)?.add(t);
      connectionMap.get(t)?.add(s);
    });

    // Interactions
    node.on("mouseenter", function (event, d) {
      d3.select(this).select("circle").attr("stroke-width", 4);
      const connectedIds = connectionMap.get(d.id) || new Set();
      link.attr("stroke-opacity", e => {
        const sourceId = typeof e.source === 'object' ? (e.source as NodeData).id : e.source;
        const targetId = typeof e.target === 'object' ? (e.target as NodeData).id : e.target;
        return sourceId === d.id || targetId === d.id ? 0.9 : 0.05;
      }).attr("stroke", e => {
        const sourceId = typeof e.source === 'object' ? (e.source as NodeData).id : e.source;
        const targetId = typeof e.target === 'object' ? (e.target as NodeData).id : e.target;
        return sourceId === d.id || targetId === d.id ? COLORS.accent : COLORS.border;
      });
      node.attr("opacity", n => connectedIds.has(n.id) ? 1 : 0.15);
    })
    .on("mouseleave", function () {
      d3.select(this).select("circle").attr("stroke-width", 2);
      link.attr("stroke-opacity", e => 0.2 + (e.weight / maxWeight) * 0.6).attr("stroke", COLORS.border);
      node.attr("opacity", 1);
    })
    .on("click", (event, d) => {
      event.stopPropagation();
      setSelectedNode(prev => prev?.id === d.id ? null : d);
    });

    svg.on("click", () => setSelectedNode(null));

    // Simulation
    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink<NodeData, EdgeData>(edges).id(d => d.id).distance(d => 100 - d.weight * 1.5).strength(d => 0.2 + d.weight / maxWeight * 0.4))
      .force("charge", d3.forceManyBody().strength(d => -150 - radiusScale((d as NodeData).count) * 6))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => radiusScale((d as NodeData).count) + 30))
      .force("x", d3.forceX(width / 2).strength(0.02))
      .force("y", d3.forceY(height / 2).strength(0.02))
      .stop();

    for (let i = 0; i < 300; i++) sim.tick();
    nodes.forEach(n => { n.fx = n.x; n.fy = n.y; });

    link
      .attr("x1", d => (d.source as NodeData).x!)
      .attr("y1", d => (d.source as NodeData).y!)
      .attr("x2", d => (d.target as NodeData).x!)
      .attr("y2", d => (d.target as NodeData).y!);
    node.attr("transform", d => `translate(${d.x},${d.y})`);
  }, [dimensions, activeCategories, searchTerm, maxCount, maxWeight, radiusScale]);

  const toggleCategory = (cat: string) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const getConnections = (nodeId: string) => {
    return RAW_EDGES
      .filter(e => e.source === nodeId || e.target === nodeId)
      .map(e => ({
        name: e.source === nodeId ? e.target : e.source,
        weight: e.weight,
        category: RAW_NODES.find(n => n.id === (e.source === nodeId ? e.target : e.source))?.category || "unknown",
      }))
      .sort((a, b) => b.weight - a.weight);
  };

  return (
    <div style={{
      width: "100vw", height: "100vh", background: COLORS.bg,
      fontFamily: "Helvetica, Arial, sans-serif",
      display: "flex", flexDirection: "column", overflow: "hidden", color: COLORS.text,
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px", background: COLORS.bg,
        borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 8, height: 8, background: COLORS.accent }} />
          <span style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
            Epstein Network
          </span>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 16px", background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`,
            color: COLORS.text, fontSize: "13px", outline: "none", fontFamily: "inherit",
            width: "240px",
          }}
        />
        <span style={{ fontSize: "11px", color: COLORS.textMuted, marginLeft: "auto", letterSpacing: "-0.01em" }}>
          {RAW_NODES.length} ENTITIES / {RAW_EDGES.length} CONNECTIONS
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{
          width: "160px", padding: "12px", background: COLORS.bgAlt, borderRight: `1px solid ${COLORS.border}`,
          overflowY: "auto", flexShrink: 0,
        }}>
          <div style={{ fontSize: "10px", color: COLORS.textMuted, fontWeight: 500, letterSpacing: "0.05em", marginBottom: "12px" }}>
            CATEGORIES
          </div>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => {
            const count = RAW_NODES.filter(n => n.category === cat).length;
            if (count === 0) return null;
            const active = activeCategories.has(cat);
            return (
              <div
                key={cat}
                onClick={() => toggleCategory(cat)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px", padding: "8px",
                  marginBottom: "2px", cursor: "pointer",
                  opacity: active ? 1 : 0.3, transition: "opacity 0.2s",
                }}
              >
                <div style={{ width: 8, height: 8, background: color }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", fontWeight: 500, color: COLORS.text }}>{CATEGORY_LABELS[cat]}</div>
                  <div style={{ fontSize: "10px", color: COLORS.textDim }}>{count}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Graph */}
        <div ref={containerRef} style={{ flex: 1, position: "relative" }}>
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height} style={{ display: "block", background: COLORS.bg }} />
          <div style={{
            position: "absolute", bottom: 16, left: 16, fontSize: "10px", color: COLORS.textDim,
            background: `${COLORS.bg}cc`, padding: "6px 10px",
          }}>
            {(zoomLevel * 100).toFixed(0)}%
          </div>
        </div>

        {/* Detail Panel */}
        {selectedNode && (
          <div style={{
            width: "300px", background: COLORS.bgAlt, borderLeft: `1px solid ${COLORS.border}`,
            overflowY: "auto", padding: "20px", flexShrink: 0,
          }}>
            {/* Close button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
              <button
                onClick={() => setSelectedNode(null)}
                style={{
                  background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer",
                  fontSize: "20px", padding: "4px",
                }}
              >
                ×
              </button>
            </div>

            {/* Avatar with initial */}
            <div style={{ marginBottom: "16px", textAlign: "center" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto",
                background: CATEGORY_COLORS[selectedNode.category],
                border: `3px solid ${COLORS.accent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "32px", fontWeight: 500, color: COLORS.text,
              }}>
                {selectedNode.id.charAt(0)}
              </div>
            </div>

            {/* Name & Category */}
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 500, marginBottom: "4px", letterSpacing: "-0.02em" }}>
                {selectedNode.id}
              </h2>
              <div style={{
                fontSize: "11px", color: CATEGORY_COLORS[selectedNode.category],
                fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em",
              }}>
                {CATEGORY_LABELS[selectedNode.category]}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 500, color: COLORS.accent }}>{selectedNode.count.toLocaleString()}</div>
                <div style={{ fontSize: "10px", color: COLORS.textDim, textTransform: "uppercase" }}>Mentions</div>
              </div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 500, color: COLORS.text }}>{getConnections(selectedNode.id).length}</div>
                <div style={{ fontSize: "10px", color: COLORS.textDim, textTransform: "uppercase" }}>Connections</div>
              </div>
            </div>

            {/* Summary */}
            {SUMMARIES[selectedNode.id] && (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "10px", color: COLORS.textMuted, fontWeight: 500, letterSpacing: "0.05em", marginBottom: "8px" }}>
                    SUMMARY
                  </div>
                  <p style={{ fontSize: "13px", lineHeight: 1.6, color: COLORS.offWhite, margin: 0 }}>
                    {SUMMARIES[selectedNode.id].summary}
                  </p>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "10px", color: COLORS.textMuted, fontWeight: 500, letterSpacing: "0.05em", marginBottom: "8px" }}>
                    EPSTEIN CONNECTION
                  </div>
                  <p style={{ fontSize: "13px", lineHeight: 1.6, color: COLORS.offWhite, margin: 0 }}>
                    {SUMMARIES[selectedNode.id].connection}
                  </p>
                </div>
              </>
            )}

            {/* Locations */}
            {Object.keys(selectedNode.locations).length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "10px", color: COLORS.textMuted, fontWeight: 500, letterSpacing: "0.05em", marginBottom: "8px" }}>
                  LOCATIONS
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {Object.entries(selectedNode.locations).sort((a, b) => b[1] - a[1]).map(([loc, cnt]) => (
                    <span key={loc} style={{
                      fontSize: "11px", padding: "4px 8px", background: COLORS.border,
                      color: COLORS.textMuted,
                    }}>
                      {loc} ({cnt})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Connections */}
            <div>
              <div style={{ fontSize: "10px", color: COLORS.textMuted, fontWeight: 500, letterSpacing: "0.05em", marginBottom: "12px" }}>
                NETWORK ({getConnections(selectedNode.id).length})
              </div>
              {getConnections(selectedNode.id).slice(0, 10).map(conn => (
                <div
                  key={conn.name as string}
                  onClick={() => {
                    const n = RAW_NODES.find(x => x.id === conn.name);
                    if (n) setSelectedNode(n as NodeData);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px", padding: "10px 0",
                    borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer",
                  }}
                >
                  <div style={{ width: 6, height: 6, background: CATEGORY_COLORS[conn.category] }} />
                  <div style={{ flex: 1, fontSize: "12px" }}>{conn.name as string}</div>
                  <div style={{ fontSize: "11px", color: COLORS.textDim }}>{conn.weight}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

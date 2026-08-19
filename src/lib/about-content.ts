/**
 * Expanded About-page copy.
 *
 * FAQ questions 1-5 are the exact questions from the live WordPress About page;
 * the answers were written for this rebuild. No invented figures anywhere.
 */
import type { Faq } from './geo/types';

export const about = {
  "missionHeadline": "Our job is to turn your marketing budget into booked work you can trace back to the ad that caused it.",
  "missionHighlight": "booked work you can trace back",
  "missionBody": [
    "ITZ Digital exists because small businesses keep paying agency retainers and never find out what they bought. Owners get a slide of impressions and a bill. We started the other way around: pick the number that matters to your business \u2014 a signed case, a booked appointment, a listing appointment, an enrolled student, a car sold \u2014 and work backward to the channels that move it.",
    "We work with owner-operators and practice managers in five fields: law, medicine and dentistry, real estate, education, and automotive. Those five share a pattern \u2014 high-value inquiries, a phone that has to get answered, and rules about what you can claim in an ad. Knowing those rules is most of the job. If your business does not fit, we will say so."
  ],
  "perks": [
    "You own every account \u2014 ads, analytics, domain, website \u2014 from day one, and keep them.",
    "Reporting starts with booked calls, forms and appointments; impressions and clicks come second.",
    "We only work in five industries, so we already know your compliance rules and buying cycle.",
    "If a channel is wrong for you, we say so before you spend, not after.",
    "Month-to-month agreements. No multi-year lock-in, no exit fee for taking your accounts with you."
  ],
  "whatWeDoHeadline": "We run the whole path from a stranger seeing your name to a customer on the phone.",
  "whatWeDoHighlight": "the whole path",
  "whatWeDoBody": "Six things, mostly. Programmatic advertising puts your ad on the screens your buyers already use: TV, phone, radio apps, billboards. We design and build the website those ads point at, then host it, patch it and keep it fast, because a slow site is an expensive way to lose a click. SEO earns the traffic you don't pay per click for. We buy and manage social ads on Facebook, Instagram and beyond. And we watch your reviews, so the first thing people read isn't the worst thing anyone wrote.",
  "faqs": [
    {
      "question": "What if all impressions aren't delivered?",
      "answer": "You only pay for what runs. Programmatic and display campaigns are billed on delivered impressions, so an underdelivery shows up as unspent budget rather than a charge. When we see a flight tracking behind pace, we tell you before the end date and give you the choice: extend the flight, widen the targeting, or take the money back. Underdelivery usually means the audience was drawn too tight \u2014 that's a signal worth acting on, not just a refund."
    },
    {
      "question": "Can an ad be edited while the campaign is live?",
      "answer": "Yes. Copy, images, landing page URLs, budgets and targeting can all change mid-flight. Two caveats. New creative goes back through platform review, which is usually minutes but can take a day. And on Google and Meta, edits reset the learning period, so an algorithm that had figured out who to show your ad to starts over. We batch small changes into a weekly release rather than nudging a campaign daily."
    },
    {
      "question": "Do we get to keep the digital ads that ITZ built?",
      "answer": "Yes. Ad creative we produce for you is yours \u2014 the layered files, the video cuts, the copy. Same for the accounts: Google Ads, Meta Business Manager and your analytics stay in your name, with us added as a user you can remove. Stock photography and licensed music are the one exception, since those licenses carry their own terms, and we'll tell you which assets they cover."
    },
    {
      "question": "How quickly can we launch a campaign?",
      "answer": "A paid search or social campaign on an existing account can be live in about a week. The gating item is almost never the ads \u2014 it's access, tracking and the page the click lands on. Programmatic flights need longer because inventory is booked ahead. Local Service Ads take longest: license and background checks run on Google's timeline, not ours. If you need something live sooner, we'll tell you which corners that cuts."
    },
    {
      "question": "What should my budget be for a digital campaign?",
      "answer": "Three things set it: what a click costs in your category and metro, what one customer is worth to you, and how many you can actually handle. A personal injury click costs many times what a dental hygiene click costs, so the same budget buys very different volume. Work backward \u2014 take the revenue from one closed job, decide what you'd pay to win it, and multiply by the jobs you want. We'll price your market before you commit."
    },
    {
      "question": "How long before we can tell if this is working?",
      "answer": "Paid ads tell you inside two to four weeks whether the offer and targeting are right, though bidding needs roughly a month of conversion data before it steadies. SEO is slower: expect first ranking movement around 90 days and meaningful lead volume between months four and six. We set a review at 90 days against agreed numbers. If a channel isn't earning its budget by then, we move the money instead of defending the plan."
    }
  ]
} satisfies {
  missionHeadline: string;
  missionHighlight: string;
  missionBody: string[];
  perks: string[];
  whatWeDoHeadline: string;
  whatWeDoHighlight: string;
  whatWeDoBody: string;
  faqs: Faq[];
};

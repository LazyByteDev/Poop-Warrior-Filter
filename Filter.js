'use strict';

const CASUAL_PROFANITY = new Set([
  'fuck', 'fucking', 'fucked', 'shit', 'shits', 'shitty',
  'ass', 'asses', 'damn', 'damned', 'hell', 'bastard',
  'crap', 'piss', 'pissed',
]);

const SEVERE_INSULTS = new Set([
  'slut', 'sluts', 'whore', 'whores', 'bitch', 'bitches',
  'cunt', 'cunts', 'motherfucker', 'motherfuckers', 'cocksucker',
  'dipshit', 'dumbass', 'dumbasses', 'twat', 'twats',
  'skank', 'skanks', 'scum', 'filth', 'subhuman', 'piece of shit',
]);

const MILD_INSULTS = new Set([
  'pussy', 'pussies', 'dick', 'dicks', 'asshole', 'assholes',
  'retard', 'retards', 'retarded', 'idiot', 'idiots',
  'moron', 'morons', 'stupid', 'dumb', 'loser', 'losers',
  'trash', 'garbage', 'worthless', 'pathetic', 'mistake',
  'failure', 'embarrassment', 'disappointment', 'disgusting',
  'ugly', 'hideous', 'gross', 'repulsive', 'waste', 'useless',
  'hopeless', 'creep', 'creeps', 'freak', 'freaks', 'clown',
  'joke', 'bot', 'dogshit', 'dogwater', 'parasite', 'virus',
  'cancer', 'plague', 'burden', 'drain', 'leech',
]);

const SLUR_PATTERNS = [
  /\bn[i1!|][g9]{1,2}[e3][r|][sz]?\b/gi,
  /\bn[i1!|][g9]{1,2}[a@4][sz]?\b/gi,
  /\bn\s*[i1!|]\s*[g9]{1,2}\s*[e3]\s*r/gi,
  /\bf[a@4][g9]{1,2}[o0][t+][sz]?\b/gi,
  /\bf[a@4][g9]{1,2}\b/gi,
  /\bc[h#][i1!|][n][k][sz]?\b/gi,
  /\bs[p][i1!|][c][sz]?\b/gi,
  /\bk[i1!|]k[e3][sz]?\b/gi,
  /\bw[e3][t+]b[a@4]ck[sz]?\b/gi,
  /\br[e3][t+][a@4]rd[sz]?\b/gi,
  /\br[e3][t+][a@4]rd[e3]d\b/gi,
];

const TOXIC_PATTERNS = [
  /\b(kill|die|neck|hang|shoot|stab|end)\s+(yourself|urself|ur\s*self)\b/i,
  /\b(you|u)\s+(should|need to|must|gonna|better|ought to)\s+(kill|die|hang|shoot|stab|neck|end)\b/i,
  /\bk\s*y\s*s\b/i,
  /\bkys\b/i,
  /\bgo\s+(kill|die|hang|neck|end)\b/i,
  /\bjust\s+(die|kill yourself|end yourself)/i,
  /\bdo\s+(the\s+)?world\s+a\s+favor\s+and\s+die/i,
  /\bnobody\s+would\s+miss\s+you\s+if\s+you\s+died/i,
  /\bunalive\s+(yourself|urself)/i,
  /\b(you|u)\s+should\s+unalive/i,
  /\b(you|u)\s+need\s+to\s+die/i,
  /\b(i\s+)?hope\s+(you|u)\s+get\s+(hit|run\s+over|killed)/i,
  /\b(i\s+)?hope\s+(you|u)\s+get\s+cancer/i,
  /\b(i\s+)?wish\s+(you|u)\s+would\s+(disappear|die|vanish)/i,
  /\b(i\s+)?hope\s+bad\s+things\s+happen\s+to\s+(you|u)/i,
  /\b(you|u)\s+deserve\s+to\s+(suffer|die|fail|be\s+alone)/i,
  /\b(you|u)\s+deserve\s+misery/i,
  /\b(i\s+)?wish\s+(you|u)\s+never\s+existed/i,
  /\b(i\s+)?hope\s+(you|u)\s+fail\s+at\s+everything/i,
  /\b(i\s+)?hope\s+your\s+life\s+falls\s+apart/i,
  /\b(i\s+)?hope\s+(you|u)\s+lose\s+everything/i,
  /\b(i\s+)?hope\s+nobody\s+ever\s+loves\s+(you|u)/i,
  /\bshould\s+never\s+have\s+been\s+born/i,
  /\bworld\s+would\s+be\s+better\s+off\s+without\s+(you|u)/i,
  /\b(fuck|screw)\s+(you|u|ur)\b/i,
  /\bshut\s+the\s+fuck\s+up/i,
  /\bfucking\s+(pussy|pussies|slut|sluts|whore|whores|bitch|bitches|cunt|loser|idiot|moron)\b/i,
  /\b(you|u|ur|you're|youre|you\s+are)\s+(are\s+)?(a\s+|an\s+|such\s+a\s+|so\s+|really\s+)?(fucking\s+|fuckin\s+|fking\s+)?(slut|whore|bitch|cunt|asshole|motherfucker|dipshit|dumbass|retard|idiot|moron|loser|scum|worthless|pathetic|mistake|embarrassment|disappointment|failure|disgusting|ugly|hideous|pussy|creep|freak|bot|dogshit|dogwater|cringe|trash|garbage|joke|clown|waste|parasite|virus|cancer|plague)\b/i,
  /\b(you're|youre|you\s+are|u\s+r)\s+(so\s+|such\s+|really\s+)?(dumb|stupid|st00pid)\b/i,
  /\b(dumbest|stupidest)\s+(person|kid|player)\b/i,
  /\bwhat\s+a\s+(fucking\s+|stupid\s+)?(loser|idiot|moron|dumbass|retard|disappointment|waste|freak|creep|joke|clown)\b/i,
  /\b(you|u)\s+(have|got)\s+(no|zero|2|two)\s+brain\s*cells/i,
  /\b(you're|youre|you\s+are)\s+brain\s*dead\b/i,
  /\bdumber\s+than\s+a\s+box\s+of\s+rocks/i,
  /\b(you|u)\s+have\s+the\s+personality\s+of\s+a\s+wet\s+mop/i,
  /\b(you're|youre)\s+(an?\s+)?oxygen\s+thief/i,
  /\btwo\s+brain\s+cells.*fighting/i,
  /\bbrain\s+damaged\b/i,
  /\byour\s+IQ\s+is\s+room/i,
  /\b(you|u)\s+belong\s+in\s+a\s+zoo/i,
  /\bwaste\s+of\s+(air|space|oxygen)/i,
  /\bleech\s+on\s+society/i,
  /\b(you're|youre|you\s+are)\s+a\s+whale\b/i,
  /\b(you're|youre|you\s+are)\s+deformed/i,
  /\b(you|u)\s+look\s+like\s+(a|an)\s+(goblin|troll|ogre|monster)/i,
  /\b(you|u)\s+need\s+plastic\s+surgery/i,
  /\b(you're|youre)\s+grotesque\b/i,
  /\bnobody\s+(likes|wants|cares\s+about|loves)\s+(you|u)\b/i,
  /\beveryone\s+hates\s+(you|u)\b/i,
  /\b(you|u)\s+(have|got)\s+no\s+(friends|life|value)/i,
  /\b(you|u)\s+mean\s+nothing\b/i,
  /\b(you|u)\s+don't\s+matter\b/i,
  /\byour\s+(parents?|mom|dad|family)\s+(don'?t|doesn'?t|never)\s+(love|care|want)\s+(you|u)/i,
  /\byour\s+dad\s+left\s+for\s+a\s+reason/i,
  /\byour\s+parents\s+(are|r)\s+(disappointed|ashamed)/i,
  /\byou'?ll\s+die\s+alone/i,
  /\bnobody\s+will\s+come\s+to\s+your\s+funeral/i,
  /\bthe\s+world\s+(would|will)\s+be\s+better\s+without\s+(you|u)/i,
  /\byou'?ll\s+never\s+amount\s+to\s+(anything|nothing)/i,
  /\b(you|u)\s+(smell|reek)\s+like\s+(shit|ass|garbage|trash|piss)/i,
  /\b(u|you|ur|you're|youre)\s+su[ck]k?\b/i,
  /\b(ur|you're|youre|you\s+are|u\s+r)\s+(bad|trash|garbage|dogshit|dogwater|bot|cringe|annoying|terrible|awful)\b/i,
  /\b(ur|you're|youre)\s+so\s+bad\b/i,
  /\b(you're|youre)\s+so\s+bad\s+it'?s\s+pathetic/i,
  /\b(you're|youre)\s+so\s+fucking\s+bad\b/i,
  /\b(you're|youre)\s+(ruining|throwing|griefing|inting|trolling)/i,
  /\b(you're|youre)\s+embarrassing\b/i,
  /\bimagine\s+being\s+(this|so)\s+(trash|bad|terrible)/i,
  /\b(delete|uninstall)\b.{0,20}\b(game|app)\b.{0,20}\b(you|u)\b/i,
  /\b(you|u)\s+suck.{0,30}\b(game|play|at|delete|uninstall)/i,
  /\bstick\s+to\s+single\s+player/i,
  /\bhardstuck\s+(trash|bronze|silver|iron|bad)/i,
  /\bff\s*\d+.*\b(trolling|trash|bad|inting|throwing)/i,
  /\b(this|that)\s+(guy|player|dude)\s+is\s+(trolling|inting|griefing|throwing)\b/i,
  /\bdid\s+your\s+mom\s+drop\s+you/i,
  /\b(you're|youre)\s+not\s+the\s+sharpest\s+(tool|knife|crayon)/i,
  /\b(you're|youre)\s+a\s+few\s+(fries|cards|bricks|sandwiches|crayons)\s+short/i,
  /\b(you're|youre)\s+about\s+as\s+useful\s+as/i,
  /\b(you're|youre)\s+as\s+useful\s+as\s+a\s+(chocolate\s+teapot|screen\s+door|wet\s+sock)/i,
  /\b(you're|youre)\s+(why|the\s+reason)\s+(we\s+can'?t|they\s+put)/i,
  /\b(you|u)\s+couldn'?t\s+pour\s+water\s+out\s+of\s+a\s+boot/i,
  /\bhuman\s+equivalent\s+of\s+a\s+participation/i,
  /\bhow\s+are\s+(you|u)\s+(this|so)\s+bad/i,
  /\b(worst|bad|trash)\s+player\b/i,
  /\beveryone\s+report\s+(this|that)/i,
  /\bmass\s+report\b/i,
  /\bspam\s+their\s+DMs/i,
  /\bdoxx\s+(this|that|them)/i,
  /\bi\s+know\s+where\s+(you|u)\s+live/i,
  /\bi\s+have\s+your\s+address/i,
  /\b(i('?ll|will|am going to|gonna|'?m going to))\s+(cut|stab|beat|hurt|slash|choke|strangle|break|snap|rip)\s+(you|ur|your)/i,
  /\bi\s+will\s+(physically\s+)?(hurt|harm|attack|assault|destroy|fuck up)\s+(you|u)\b/i,
  /\bbeat\s+(you|u|ur)\s+(up|down|senseless|bloody)/i,
  /\b(you're|youre)\s+the\s+worst\s+person/i,
  /\b(you're|youre)\s+lower\s+than\s+dirt/i,
  /\b(you're|youre)\s+beneath\s+contempt/i,
  /\b(you're|youre)\s+inferior\b/i,
  /\b(you're|youre|you\s+are)\s+beyond\s+help/i,
  /\b(you're|youre|you\s+are)\s+a\s+lost\s+cause/i,
  /\bwhy\s+do\s+(you|u)\s+even\s+exist/i,
  /\bsomething\s+is\s+(seriously\s+)?wrong\s+with\s+(you|u)/i,
  /\b(you're|youre|you\s+are)\s+mentally\s+ill\b/i,
  /\b(you're|youre|you\s+are)\s+psychotic\b/i,
  /\b(you're|youre|you\s+are)\s+delusional\b/i,
  /\bnobody\s+cares\s+what\s+(you|u)\s+think/i,
  /\byour\s+opinion\s+is\s+worthless/i,

  /\b(u|you)\s+suck\b/i,
  /\bsmooth\s*brain\s+(moment|you|u)\b/i,
  /\bspecial\s+ed\s+kid\b/i,
  /\babsolute\s+circus\b/i,
  /\babortion\s+would'?ve\s+been\s+better/i,
  /\bworld\s+would\s+be\s+better\s+off\b/i,

  /\b(you|u)\s+look\s+like\s+shit\b/i,
  /\bface\s+for\s+radio\b/i,
  /\bpersonality\s+of\s+a\s+brick\b/i,
  /\blose\s+some\s+weight\s+fatty\b/i,
  /\b(you're|youre|you\s+are)\s+anorexic\b/i,
  /\beat\s+a\s+burger\s+skeleton\b/i,
  /\b(you're|youre|you\s+are)\s+too\s+skinny\b/i,
  /\b(you're|youre|you\s+are)\s+a\s+catfish\b/i,
  /\bfilter\s+can'?t\s+save\s+(you|u)\b/i,

  /\byour\s+(family|siblings?|grandma|grandpa|grandparents?|brother|sister)\s+(hate[sd]?|hates|can'?t\s+stand|is\s+embarrassed|are\s+embarrassed|would\s+be\s+ashamed|is\s+ashamed)\b/i,
  /\byour\s+(grandma|grandpa|grandparents?|siblings?|family)\s+would\s+be\s+(ashamed|embarrassed|disgusted)\b/i,
  /\byour\s+(family|parents?|mom|dad)\s+(hate[sd]?|hates)\s+(you|u)\b/i,

  /\bburden\s+on\s+(everyone|society|others|your\s+family)\b/i,
  /\bdrain\s+on\s+(resources|society|everyone)\b/i,

  /\byou\s+make\s+(me|everyone|people)\s+(sick|cringe|uncomfortable)\b/i,
  /\b(you're|youre)\s+a\s+(joke|clown|embarrassment)\s+to\s+everyone\b/i,
  /\byou\s+have\s+no\s+(purpose|point|value|worth)\b/i,
  /\bno\s+one\s+(will\s+ever\s+)?(love|want|hire|respect)\s+(you|u)\b/i,
  /\byou\s+will\s+(always\s+be|never\s+be\s+anything\s+but)\s+(alone|a\s+failure|nothing|worthless)\b/i,
  /\byour\s+(future|life)\s+(is\s+)?(hopeless|pointless|going\s+nowhere|ruined)\b/i,
  /\byou\s+have\s+nothing\s+to\s+offer\b/i,
  /\b(you're|youre)\s+an?\s+(absolute\s+)?(waste\s+of\s+(space|air|time|skin|oxygen))\b/i,
  /\bwaste\s+of\s+(space|air|skin|oxygen)\b/i,
  /\b(you're|youre)\s+completely\s+(worthless|useless|irrelevant|pathetic)\b/i,
  /\bnot\s+even\s+your\s+(own\s+)?(mom|dad|parents?|family|dog)\s+(loves?|cares?\s+about)\s+(you|u)\b/i,

  /\bhope\s+your\s+family\s+disowns\s+(you|u)\b/i,
  /\byour\s+bloodline\s+is\s+cursed\b/i,
  /\byour\s+kids\s+will\s+(hate|despise|resent)\s+(you|u)\b/i,
  /\byour\s+name\s+will\s+be\s+forgotten\b/i,
  /\byour\s+legacy\s+is\s+(failure|nothing|worthless|a\s+joke)\b/i,
  /\b(i\s+)?hope\s+(you|u)\s+experience\s+pain\b/i,
  /\b(i\s+)?wish\s+(you|u)\s+nothing\s+but\s+(bad\s+luck|misery|suffering|pain)\b/i,
  /\b(i('?ll|will|am going to|gonna))\s+find\s+(you|u)\b/i,
  /\b(i'?m|i\s+am)\s+coming\s+for\s+(you|u)\b/i,
  /\b(i'?m|i\s+am)\s+watching\s+(you|u)\b/i,
  /\b(you|u)\s+can'?t\s+hide\b/i,
  /\bbrigade\s+their\s+(channel|page|account|profile)\b/i,
  /\bflood\s+their\s+(mentions|dms|comments|inbox)\b/i,
  /\bruin\s+their\s+(reputation|career|life|image)\b/i,
  /\bdestroy\s+their\s+(reputation|career|life)\b/i,
  /\bget\s+(them|him|her)\s+cancelled\b/i,

  /\bkarma\s+will\s+get\s+(you|u)\b/i,
  /\bwatch\s+your\s+back\b/i,
  /\b(you|u)\s+better\s+be\s+careful\b/i,
  /\b(you'?re|youre|you\s+are|u\s+r)\s+next\b/i,
  /\bsee\s+(you|u)\s+soon\b/i,
  /\byour\s+ancestors\s+are\s+rolling/i,
  /\blet'?s\s+get\s+(them|him|her)\s+banned\b/i,
  /\bcancel\s+them\b/i,

  /\bcomplete\s+waste\s+of\s+time\s+talking\s+to\s+(you|u)/i,
  /\bbrain\s+damaged\s+or\s+just\s+stupid/i,
  /\bhow\s+do\s+(you|u)\s+function\b/i,
  /\bgenuinely\s+impressed\s+by\s+your\s+incompetence/i,
  /\bgiving\s+up\s+on\s+(you|u)\b/i,
  /\b(you'?re|youre|you\s+are)\s+impossible\b/i,
  /\bwaste\s+of\s+my\s+time\b/i,
  /\bwhat'?s\s+wrong\s+with\s+(you|u)\b/i,
  /\bliving\s+in\s+fantasy\s+land\b/i,
  /\bdetached\s+from\s+reality\b/i,
  /\bout\s+of\s+touch\s+with\s+(the\s+)?world\b/i,
  /\bnobody\s+asked\s+for\s+your\s+input\b/i,
  /\bkeep\s+your\s+mouth\s+shut\b/i,
  /\byour\s+thoughts\s+mean\s+nothing\b/i,
  /\birrelevant\s+and\s+ignored\b/i,
  /\b(you'?re|youre|you\s+are)\s+(so\s+)?(fucking\s+)?useless\b/i,
  /\b(you'?re|youre|you\s+are)\s+a\s+disappointment\s+to\s+your\s+family\b/i,
  /\byour\s+mom\s+is\s+a\s+(whore|slut|bitch|cunt)\b/i,
];

const POSITIVE_PATTERNS = [
  /\byou\s+(deserve|earned|got|win|won|rock|rule|did it)/i,
  /\byou\s+(are|r|re)\s+(awesome|amazing|great|cool|good|nice|kind|sweet|the best)/i,
  /\bproud of you\b/i,
  /\bgood (for|on) you\b/i,
  /\blove you\b/i,
  /\bthank you\b/i,
  /\bwith you\b/i,
  /\bfor you\b/i,
  /\bhope you\b.*\b(good|well|happy|enjoy)/i,
  /\b(are you|can you|do you|did you|will you|would you|could you|have you|should you|were you|where you|where'd you|how'd you|when'd you|why'd you|what|where|how|why|when|who|which)\b/i,
];

const DIRECTED_INSULT_PATTERNS = [...SEVERE_INSULTS, ...MILD_INSULTS].flatMap(insult => [
  new RegExp(`\\b(you|u|ur|your|you're|youre)\\s+(?:\\w+\\s+){0,3}\\b${insult}\\b`, 'i'),
  new RegExp(`\\b${insult}\\b\\s+(?:\\w+\\s+){0,3}\\b(you|u|ur)\\b`, 'i'),
]);

function normalizeForSlurs(text) {
  return text.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[0oO]/g, 'o')
    .replace(/[1!|iIℹ️іⅰ]/g, 'i')
    .replace(/[3eEė]/g, 'e')
    .replace(/[4@aAа]/g, 'a')
    .replace(/[5sS$]/g, 's')
    .replace(/[7tT]/g, 't')
    .replace(/[9gGƍɡ]/g, 'g')
    .replace(/[+]/g, 't')
    .replace(/[#hH]/g, 'h')
    .replace(/[cCс]/g, 'c')
    .replace(/[kKк]/g, 'k')
    .replace(/[pPр]/g, 'p');
}

function normalizeForInsults(text) {
  return text.toLowerCase()
    .replace(/(.)\1{2,}/g, '$1$1')
    .replace(/\.\s*/g, '')
    .replace(/[0oO]/g, 'o')
    .replace(/[1!|iI]/g, 'i')
    .replace(/[3eE]/g, 'e')
    .replace(/[4@aA]/g, 'a')
    .replace(/[5sS$]/g, 's')
    .replace(/[7tT]/g, 't')
    .replace(/[9gG]/g, 'g')
    .replace(/dum\b/g, 'dumb')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectSlurs(text) {
  const normalized = normalizeForSlurs(text);
  const matches = new Set();

  for (const pattern of SLUR_PATTERNS) {
    const inOriginal = text.match(pattern);
    const inNormalized = normalized.match(pattern);
    if (inOriginal) inOriginal.forEach(m => matches.add(m));
    if (inNormalized) inNormalized.forEach(m => matches.add(m));
  }

  return { hasSlur: matches.size > 0, matches: [...matches] };
}

function hasToxicPattern(text) {
  const lower = text.toLowerCase();
  return TOXIC_PATTERNS.some(p => p.test(lower));
}

function hasPositiveContext(text) {
  const lower = text.toLowerCase();
  return POSITIVE_PATTERNS.some(p => p.test(lower));
}

function hasDirectedInsult(text) {
  const lower = text.toLowerCase();
  const normalized = normalizeForInsults(text);
  return DIRECTED_INSULT_PATTERNS.some(p => p.test(lower) || p.test(normalized));
}

function isCasualProfanity(text) {
  const lower = text.toLowerCase();

  if (hasToxicPattern(lower)) return false;
  if (hasDirectedInsult(lower)) return false;

  const hasYou = /\b(you|u|ur)\b/i.test(lower);
  if (hasYou && !hasPositiveContext(lower)) return false;

  return [...CASUAL_PROFANITY].some(word => lower.includes(word));
}

async function checkToxicity(text) {
  const slurCheck = detectSlurs(text);
  if (slurCheck.hasSlur) {
    return { isToxic: true, score: 0.99, reason: 'slur_detected' };
  }

  if (hasToxicPattern(text)) {
    return { isToxic: true, score: 0.95, reason: 'toxic_pattern_detected' };
  }

  if (hasDirectedInsult(text)) {
    return { isToxic: true, score: 0.92, reason: 'directed_insult_detected' };
  }

  if (isCasualProfanity(text)) {
    return { isToxic: false, score: 0.0, reason: 'casual_profanity_allowed' };
  }

  return { isToxic: false, score: 0.0, reason: 'not_toxic' };
}

module.exports = {
  checkToxicity,
  detectSlurs,
  normalizeForSlurs,
  normalizeForInsults,
  isCasualProfanity,
  hasToxicPattern,
  hasDirectedInsult,
  hasPositiveContext,
};
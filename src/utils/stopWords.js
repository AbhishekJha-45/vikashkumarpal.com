export const containsRestrictedWords = (text) => {
    const blockedWords = [
        "sex", "porn", "viagra", "casino", "weed", "marijuana", "cocaine",
        "heroin", "meth", "jackpot", "betting", "blackjack", "poker", "slots",
        "dildo", "fetish", "xxx", "nude", "erotic", "deepthroat", "shemale",
        "blowjob", "gangbang", "fuck", "drugs", "boobs", "breasts", "cunt",
        "fucker", "shit", "asshole", "motherfucker","ass","pussy","dick"
    ];

    return text.some((word) => blockedWords.includes(word.toLowerCase()));
};

export const containsUrl = (text) => {

    const urlRegex = /(?:https?:\/\/|www\.)[^\s]+|\b\w+\.(?:com|org|net|io|gov)[^\s]*\b/gi;
    return urlRegex.test(text);
};

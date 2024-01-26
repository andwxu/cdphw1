// @ts-nocheck
import { writable, derived } from 'svelte/store';

export const bookSearch = writable([]);
export const bookNames = derived(bookSearch, ($bookSearch) => {
    if ($bookSearch.docs) {
        return $bookSearch.docs.map(doc => doc.title);
    }
    return [];
});

export let titles = [
    "story beat generator",
    "that's a good start",
    "what a twist, keep going!",
    "i like it quite a bit so far",
    "do i sound impressed?",
    "a story is like a poem, sort of",
    "badum, badum, badum",
    "these are great, take notes!",
    "give literature a chance",
    "life isn't a rush",
    "does it seem nonsensical?",
    "or does it make sense?",
    "don't get wrapped up in the details",
    "are the creative juices flowing?",
    "the title can't keep changing, you know",
    "we're going to run out of ideas",
    "beat generator™",
    "generbeaterator",
    "never ask for permission in writing",
    "life is like a box of __?",
    "you're really going at that button",
    "the story's gotta stop at some point",
    "unless this is a television show",
    "i'm out of responses",
    "i'm just going to list some books",
    "they're sourced from openlibrary"
];
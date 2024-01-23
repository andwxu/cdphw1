<body>
    {#key titleText}
        <h1 in:fade>{titleText}</h1>
    {/key}
    <button on:click={btnclick}>add a story beat</button>
    <div bind:this={beats}>
    </div>
</body>

<script>
    import { titles, bookNames, bookSearch } from '$lib/title-text';
    import { verbs, transitions } from '$lib/beat-text';
	import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    onMount(async() => {
        fetch("https://openlibrary.org/search.json?q=the+blue")
            .then(response => response.json())
            .then(data => {
                bookSearch.set(data);
            }).catch(error => {
                console.log(error);
                return [];
            });
    });

    /**
	 * @type {HTMLDivElement}
	 */
    let beats;
    let titleIndex = 0;
    let ontoBooks = false;
    let titleText = titles[titleIndex];
    /**
     * @type {string}
     * Previous word is set by the latest story beat's noun to keep some relation between beats
     */
    let previousNoun = "person";

    const btnclick = async () => {
        getWord(previousNoun);
        if (!ontoBooks) {
            titleText = titles[++titleIndex];
            if (titleIndex >= titles.length) {
                ontoBooks = true;
                titleIndex = 0;
            }
        } else {
            titleText = $bookNames[titleIndex++];
            if (titleIndex > $bookNames.length) titleIndex = 0;
        }
    }

    /**
	 * @param {string} previousNoun
     * Generates a new sentence (probably a bad function name)
	 */
    function getWord(previousNoun) {
        const url = "https://api.datamuse.com/words?ml=" + previousNoun;
        const adjUrl = "https://api.datamuse.com/words?rel_jjb=" + previousNoun;
        let verb = verbs[Math.floor(Math.random() * verbs.length)];
        let transition = transitions[Math.floor(Math.random() * transitions.length)];
        fetch(url)
            .then(response => response.json())
            .then(noun => {
                let i = Math.floor(Math.random() * noun.length);
                let subject = noun[i].word;
                let originalI = i;
                while (noun[i].word.includes('-') || noun[i].word.includes(' ')) {
                    i = (i + 1) % noun.length;
                    if (i == originalI) subject = "person";
                }

                fetch(adjUrl)
                    .then(response => response.json())
                    .then(adj => {
                        i = Math.floor(Math.random() * adj.length);
                        let adjective = adj[i].word;

                        const objUrl = "https://api.datamuse.com/words?rel_jja=" + subject;
                        fetch(objUrl)
                            .then(response => response.json())
                            .then(obj => {
                                i = Math.floor(Math.random() * obj.length);
                                let object = obj[i].word;

                                beats.innerHTML += '<p>The ' + adjective + ' ' + subject + ' ' + verb + ' the ' + object + ', ' + transition + '</p>';
                                previousNoun = noun;
                            }).catch(error => {
                                console.log(error);
                                return "";
                            });
                    }).catch(error => {
                        console.log(error);
                        return "";
                    });
                    

            }).catch(error => {
                console.log(error);
                return "";
            });
    }
</script>

<style>
    body {
        font-family: 'Atkinson Hyperlegible';
        width: 750px;
        margin: 0 auto;
    }
</style>
<main>
<body>
    {#key titleText}
        <h1 in:fade>{titleText}</h1>
    {/key}
    <img class="vinyl" src={Vinyl} alt="vinyl record" bind:this={musicNote} />
    {#if musicVisible}
        <img class="music" src={Music} alt="music eighth note" />
    {/if}
    <div style="display: flex">
        <ul class="wave-menu" on:click={btnclick}>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
        <button on:click={rfshclick}><img class="restart" src={Restart} alt="restart button"/></button>
    </div>
    <div bind:this={beats}>
    </div>
</body>
</main>

<script>
    import { titles, bookNames, bookSearch } from '$lib/title-text';
    import { verbs, transitions, getStartingPrompt } from '$lib/beat-text';
	import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Vinyl from "$lib/assets/vinyl.png";
    import Restart from "$lib/assets/restart.png";
    import Music from "$lib/assets/music.png";

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
    let musicVisible = false;
    /**
	 * @type {HTMLImageElement}
	 */
    let musicNote;

    /**
     * @type {string}
     * Previous word is set by the latest story beat's noun to keep some relation between beats
     */
    let previousNoun = getStartingPrompt();

    const btnclick = async () => {
        getWord(previousNoun);
        if (!musicVisible) document.documentElement.style.setProperty('--note-end-height', Math.floor(Math.random() * 110) + 'vh')
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
        if (!musicVisible) {
            musicVisible = true;
            setTimeout(function() {musicVisible = false;}, 3000);
        }
    }

    const rfshclick = () => {
        window.location.reload();
    }

    /**
     * Generates a new sentence (probably a bad function name)
	 * @param {string} previousNoun
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
    :root {
        --note-end-height: 110vh; 
    }

    body {
        font-family: 'Atkinson Hyperlegible';
        width: 600px;
        margin: 0 auto;
        background-color: #fff7ee;
    }

    button {
        border: 4px solid #000000;
        border-radius: 50px;
        width: 100px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        margin-top: 5px;
        margin-left: 15px;
        cursor: pointer;
        transition: ease 0.2s;
        position: relative;
        background: #fff;
        font-weight: bold;
    }

    button:hover {
        background-color: black;
        color: white;
    }

    button:hover > img {
        filter: brightness(0%) invert(1);
    }

    button:active > img {
        animation: rotate 0.5s 1;
    }

    .restart {
        width: 28px;
        color: black;
        filter: brightness(0%);
    }

    .vinyl {
        width: 150px;
        float: right;
        animation: rotate 1s infinite;
        animation-timing-function: linear;
    }

    .music {
        animation: fly 3s linear infinite;
        top: 0;
	    left: 0;
	    position: fixed;
	    z-index: 999;
	    pointer-events: none;
        width: 100px;
    }
    @keyframes fly {
        /* 0%  {
            transform: translate(0,110vh);opacity: .50;
        } */
        0% {
            transform: translate(60vw, 10vh); opacity: 0;
        }
        100%{
            transform: translate(110vw, var(--note-end-height));opacity: .50;
        }
    }

    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .wave-menu {
        border: 4px solid #000000;
        border-radius: 50px;
        width: 200px;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        margin: 0;
        cursor: pointer;
        transition: ease 0.2s;
        position: relative;
        background: #fff;
    }

    .wave-menu li {
        list-style: none;
        height: 30px;
        width: 4px;
        border-radius: 10px;
        background: #000000;
        margin: 0 6px;
        padding: 0;
        animation-name: wave1;
        animation-duration: 0.3s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        transition: ease 0.2s;
    }

    .wave-menu:hover > li {
        background: #fff;
    }

    .wave-menu:hover {
        background: #000000;
    }

    .wave-menu:active > li:nth-child(1) {
        animation-name: wavemax;
    }

    .wave-menu:active > li:nth-child(2) {
        animation-name: wavemax;
    }

    .wave-menu:active > li:nth-child(3) {
        animation-name: wavemax;
    }

    .wave-menu:active > li:nth-child(4) {
        animation-name: wavemax;
    }

    .wave-menu:active > li:nth-child(5) {
        animation-name: wavemax;
    }

    .wave-menu:active > li:nth-child(6) {
        animation-name: wavemax;
    }

    .wave-menu:active > li:nth-child(7) {
        animation-name: wavemax;
    }

    .wave-menu:active > li:nth-child(8) {
        animation-name: wavemax;
    }

    .wave-menu:active > li:nth-child(9) {
        animation-name: wavemax;
    }
    
    .wave-menu:active > li:nth-child(10) {
        animation-name: wavemax;
    }

    .wave-menu li:nth-child(2) {
        animation-name: wave2;
        animation-delay: 0.2s;
    }

    .wave-menu li:nth-child(3) {
        animation-name: wave3;
        animation-delay: 0.23s;
        animation-duration: 0.4s;
    }

    .wave-menu li:nth-child(4) {
        animation-name: wave4;
        animation-delay: 0.1s;
        animation-duration: 0.3s;
    }

    .wave-menu li:nth-child(5) {
        animation-delay: 0.5s;
    }

    .wave-menu li:nth-child(6) {
        animation-name: wave2;
        animation-duration: 0.5s;
    }

    .wave-menu li:nth-child(8) {
        animation-name: wave4;
        animation-delay: 0.4s;
        animation-duration: 0.25s;
    }

    .wave-menu li:nth-child(9) {
        animation-name: wave3;
        animation-delay: 0.15s;
    }

    @keyframes wave1 {
        from {
            transform: scaleY(1);
        }

        to {
            transform: scaleY(0.5);
        }
    }

    @keyframes wave2 {
        from {
            transform: scaleY(0.3);
        }

        to {
            transform: scaleY(0.6);
        }
    }

    @keyframes wave3 {
        from {
            transform: scaleY(0.6);
        }

        to {
            transform: scaleY(0.8);
        }
    }

    @keyframes wave4 {
        from {
            transform: scaleY(0.2);
        }

        to {
            transform: scaleY(0.5);
        }
    }

    @keyframes wavemax {
        from {
            transform: scaleY(1.0);
        }

        to {
            transform: scaleY(1.0);
        }
    }

</style>
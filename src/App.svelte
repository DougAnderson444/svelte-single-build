<script>
    export let name = "Doug"
    export let offsetWidth
    export let offsetHeight
</script>

<div bind:offsetWidth bind:offsetHeight>
    <h1>Hello {name}!</h1>
    <p>Width: {offsetWidth}</p>
    <p>Height: {offsetHeight}</p>
</div>

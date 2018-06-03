<template>
    <div class="overlay">捏他芭蕾  马上回来</div>
</template>

<script>
export default {
  name: "overlay"
};
</script>

<style scoped>
    .overlay {
        font-family: "source-han-serif-sc",serif;
        position: fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background: rgba(255,255,255,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 7vh;
        writing-mode: vertical-rl;
        letter-spacing: 1.05vh;
    }
</style>

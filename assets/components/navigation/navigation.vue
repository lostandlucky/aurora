<template>
    <nav class="nav">
        <router-link :to="{name: 'pattern'}" class="nav-item" :class="{selected: selected === 'pattern'}">Pattern</router-link>
        <router-link :to="{name: 'draw'}" class="nav-item" :class="{selected: selected === 'draw'}">Draw</router-link>
        <router-link :to="{name: 'filters'}" class="nav-item" :class="{selected: selected === 'filters'}">Filters</router-link>
    </nav>
</template>

<script>
    export default {
        data() {
            return {
                selected: null
            };
        },
        watch: {
            $route: function(to, from) {
                this.selected = this.$route.name;
            }
        },
        mounted() {
            this.selected = this.$route.name;
        }
    }
</script>

<style scoped lang="sass">
    @import '../../css/theme';

    .nav {
        flex-grow: 1;
        white-space: nowrap;
        font-size: 0;
    }

    .nav-item {
        display: inline-block;
        padding: 1.5rem;
        margin: 0;
        font-size: 1rem;

        &:hover,
        &.selected {
            color: $primary;
            background: $background;
        }
    }
</style>

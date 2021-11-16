<template lang="html">
  <div class="ButtonChoice">
    <button v-for="tab in tabs" v-bind:key="tab.id" v-bind:class="['tab-button', { active: currentTabComponent === tab.id }]" @click="emitevent(tab.id)">{{ tab.name }}</button>
    <!-- <div class="line"></div> -->
  </div>
</template>

<script>
export default {
  name: "buttonChoice",
  props: ["tabs", "currentTab"],
  data() {
    return {
      currentTabComponent: this.currentTab,
    };
  },
  methods: {
    emitevent(tab) {
      this.currentTabComponent = tab;
      return this.$emit("newtab", tab);
    },
  },
};
</script>

<style lang="css" scoped>
.tab-button {
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 1rem;
  padding: 6px 10px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border: 1px solid #f0f0f0;

  cursor: pointer;
  background: #f0f0f0;
  color: #2c3e50;
}
.tab-button:hover {
  background: #e0e0e0;
  background: #f8f8f8;
}
.tab-button.active {
  background: #ffffff;
  border-bottom: #ffffff;
}

.ButtonChoice {
  display: flex;

  text-align: right;
  background: #f0f0f0;
}
</style>

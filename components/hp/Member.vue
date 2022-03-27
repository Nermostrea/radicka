<template>
  <div class="member col">
    <div class="member__image">
      <img v-if="member.image" :src="member.image" :alt="member.name">
    </div>
    <div>
      <h3>{{ member.name }}</h3>
      <p>{{ member.role }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeamMember',

  props: {
    member: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.member {
  text-align: center;
  h3 {
    margin-bottom: 12px;
  }
  &__image {
    display: block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #bfbfbf;
    margin: 0 auto 15px;
  }
}
</style>

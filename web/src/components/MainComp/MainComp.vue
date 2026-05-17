<template>
  <section class="main-layout">
    <div class="side"></div>

    <main>
      <h1>Welcome to the VOTE WORLD!</h1>
      <p>On this site, you can create votes and share your opinion about EVERYTHING!</p>
      
      <h2>IMPORTANT</h2>
      <p>
        <b>Votes can be created ONLY by authorized users!</b>
      </p>

      <h3>How does this website work?</h3>
      <p>
        You can create a vote for any idea. Have a stream and need a quick opinion from your fans? 
        No problem, you can do it here.
      </p>
      <p>If you need votes for marketing purposes, we can help with that too!</p>

      <h3>You decide how secure the vote is!</h3>
      <p>You can select:</p>
      <ul>
        <li>Mode only for logged-in users</li>
        <li>Mode only for non-logged-in users</li>
        <li>Hybrid mode (all users)</li>
        <li>One vote per user</li>
        <li>Multiple votes per user</li>
        <li>Voting duration from 1 minute to 30 days!</li>
      </ul>
    </main>
    <div class="side"></div>
  </section>
</template>

<script>
export default {
  name: 'MainComp',
  data() {
    return {
      test: "test"
    };
  }
}
</script>

<style scoped lang="scss">
.main-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: calc(100vh - 200px);
}

.side {
    width: 100%;
    max-width: 250px;
    margin: 1rem auto;
    flex-shrink: 0;
}

main {
    width: 100%;
    max-width: 900px;
    margin: 2rem auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
}

ul {
    text-align: left;
    display: inline-block;
    margin: 1rem auto;
}

@media (min-width: 768px) {
    .main-layout {
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        gap: 2rem;
    }
    
    .side {
        width: 20%;
        margin: 0;
    }
    
    main {
        width: 60%;
        margin: 0;
        flex: none;
    }
}
</style>

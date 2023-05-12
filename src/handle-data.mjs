import supabase from "./config/supabaseClient.mjs";

  /*
  This is an example function, which fetches data from the database.
  It uses Supabase API but it can also be done with GraphQL.
  This concerns all of the async functions for modyfiyng data below.
  */
  async function fetchData() {
      const { data, error } = await supabase
        .from('projects')
        .select();
        console.log(data)
      // Do something with the data or handle the error...
  }

  /*
  This is an example function, which adds a new row in the database.
  */
  async function addData(){
    const { data, error } = await supabase
      .from('projects')
      .insert([
        { project_name: 'FancyProject', repository_link: '', forks: 100, bookmarks: 45 },
      ])
  }  

  /*
  This is an example function, which removes existing rows in the database.
  */
  async function removeData(){
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('project_name', 'FancyProject')
  }  

  /*
  This is an example function, which updates existing rows in the database.
  */
  async function updateData(){
    const { error } = await supabase
      .from('projects')
      .update({ bookmarks: 5 })
      .eq('project_name', 'Truffle-AI-backend')
    return { bookmarks: 5 }
  }  

  
  /*
  Call function for fetching data and logs error message if there is one
  */
  // fetchData().catch((error) => {
  //   console.error(error);
  // });

  /*
  Call function for adding one additional row and logs error message if there is one
  */
  // addData().catch((error) => {
  //   console.error(error);
  // });

  /*
  Call function for removing rows that matches given criterium and logs error message if there is one
  */
  // removeData().catch((error) => {
  //   console.error(error);
  // });

  /*
  Call function for removing rows that matches given criterium and logs error message if there is one
  */
  updateData().catch((error) => {
    console.error(error);
  });


  /*
  Waits for an input from keyboard in order to terminate the process
  */
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 0));
  

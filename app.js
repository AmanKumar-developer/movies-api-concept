const express = require("express");
const app = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertMovieNametoPascalCase = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

//Returns a list of all movie names in the movie table
app.get("/movies/", async (request, response) => {
  const getAllMovieQuery = `
    SELECT 
    movie_name
    FROM 
    movie;`;
  const movieArray = await db.all(getAllMovieQuery);
  response.send(
    movieArray.map((moviename) => convertMovieNametoPascalCase(moviename))
  );
}); 

//Creates a new movie in the movie table. `movie_id` is auto-incremented
app.post("/movies/",async (request,response)=>{  
    const addMovieQuery = `
    INSERT INTO 
    movie (director_id,movie_name,lead_actor) 
    VALUES
    (
    ${directorId},
    '${movieName}',
   `${leadActor}`);`; 
     
    const dbResponse =await db.run(addMovieQuery) 
    response.send("Movie Successfully Added");
});   

//Convert to Pascal Case 
convertDbObjectToResponseObject = (dbObject)=>{ 
    return{
movieId:dbObject.movie_id, 
 directorId: dbObject.director_id,
movieName: dbObject.movie_name,
leadActor: dbObject.lead_actor,
    };
};


//Returns a movie based on the movie ID 
app.get("/movies/:movieId/" , async (request,response)=>{  
    const {movieId} = request.params;
    const getMovieQuery = `
    SELECT 
    * 
    FROM 
    movie
    WHERE 
    movie_id = ${movieId};`;  
    const movie = await db.get(getMovieQuery);
      console.log(movieId);
      response.send(convertDbObjectToResponseObject(movie));
}); 

//Updates the details of a movie in the movie table based on the movie ID 
app.get("/movies/:movieId/" , async (request,response)=>{  
    const {movieId} = request.params;
    const movieDetails = request.body;
    const {directorId,movieName,leadActor} = movieDetails;
    const updateMovieQuery = `
    director_id = ${directorId},
    movie_name = '${movieName}',
    lead_actor = '${leadActor}'
    WHERE 
    movie_id = ${movieId};`; 
    await db.get(updateMovieQuery); 
    response.send("Movie Details Updated");
}); 

//Deletes a movie from the movie table based on the movie ID
app.delete("/movies/:movieId/" ,async (request,response)=>{  
    const {movieId} = request.params;
    const deleteMovieQuery = `
    DELETE FROM 
    movie 
    WHERE 
    movie_id = ${movieId};`;
    await db.run(deleteMovieQuery); 
    response.send("Movie Removed");
});  

//convert to PascalCase 
ConvertDirectorDetailsToPascalCase = (dbObject)=>{
    return{
     director_id:dbObject.directorId,
     director_name:dbObject.directorName,
    }
};


//Returns a list of all directors in the director table 
app.get("/directors/" , async (request,response)=>{  
    const getAllDirectorQuery =`
    SELECT 
    *  
    FROM 
    director;`; 
    const movieArray = await db.all(getAllDirectorQuery); 
    response.send(
    movieArray.map(director)=>ConvertDirectorDetailsToPascalCase(director))
       );
}); 

const convertMovieNametoPascalCase = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};
//Returns a list of all movie names directed by a specific director 

app.get("/directors/:directorId/movies/" , async (request,response)=>{  
   const {movieId} = request.params;
   const getDirectorMovieQuery = `
   SELECT 
   movie_name
   FROM 
   director INNER JOIN movie 
   ON director.director_id = movie.director_id 
   WHERE 
   director.director_id = ${directorId};`;
   const movies = await db.all(getDirectorMovieQuery); 
   console.log(directorId);
   response.send(
       movies.map(movienames) =>convertMovieNametoPascalCase(moviename))
   );
}); 
module.exports = app;













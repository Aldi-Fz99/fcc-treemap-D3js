
const urlMovie = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let movie

const canvas = d3.select("#canvas")

const tooltip = d3.select("#tooltip")


const drawTree = () => {
  
  const hierarchy = d3.hierarchy(movie, (node) => node["children"]).sum((node) => node["value"]).sort((node1, node2) => node2["value"] - node1["value"])
  
  let createTreeMap = d3.treemap()
                        .size([1000, 600])
  
  createTreeMap(hierarchy)
  const movieTile = hierarchy.leaves()
  const block = canvas.selectAll("g")
                      .data(movieTile)
                      .enter()
                      .append("g")
                      .attr("transform", (movie) => "translate(" + movie["x0"] + ", " + movie["y0"] + ")" )
  
  block.append("rect")
       .attr("class", "tile")
       .attr("fill", (movie) => {
          const category = movie["data"]["category"]
          // Objek untuk mapping kategori ke warna
          const colors = {
            "Action": "orange",
            "Drama": "lightgreen",
            "Adventure": "coral",
            "Family": "lightblue",
            "Animation": "pink",
            "Comedy": "khaki",
            "Biography": "tan"
          };
          return colors[category];
        })
       .attr("data-name", (movie) => movie["data"]["name"])
       .attr("data-category", (movie) => movie["data"]["category"])
       .attr("data-value", (movie) => movie["data"]["value"])
       .attr("width" , (movie) => movie["x1"] - movie["x0"])
       .attr("height" , (movie) => movie["y1"] - movie["y0"])
  
      .on('mouseover', (event, movie) => {
        // Debugging: Log data untuk memastikan data benar
        console.log("Data movie:", movie);
        const revenue = movie['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const name = movie['data']['name'];

        // Debugging: Log konten tooltip untuk memastikan HTML benar
        console.log("Tooltip content:", `<strong>${name}</strong><br />Revenue: $${revenue}`);

        // Menampilkan tooltip
        tooltip.transition()
               .duration(200) // Menambahkan durasi transisi untuk efek yang lebih halus
               .style('visibility', 'visible')
               .style('left', (event.pageX + 5) + 'px')
               .style('top', (event.pageY - 28) + 'px');

        // Mengatur konten tooltip
        tooltip.html(`<strong>${name}</strong><br />Revenue: $${revenue}`)
               .attr('data-value', movie['data']['value']);
    })
    .on('mousemove', (event) => {
        // Memperbarui posisi tooltip mengikuti mouse
        tooltip.style('left', (event.pageX + 5) + 'px')
               .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => {
        // Menyembunyikan tooltip saat mouse keluar
        tooltip.transition()
               .duration(200) // Menambahkan durasi transisi untuk efek yang lebih halus
               .style('visibility', 'hidden');
    });
  
  block.append("text")
       .text(movie => movie["data"]["name"])
       .attr("x", 5)
       .attr("y", 20)
}

d3.json(urlMovie).then(
    (data, error) => {
      if(error){
        console.log(error)
      }else{
        movie = data
        drawTree()
      }
  }
)



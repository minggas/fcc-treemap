const DATA_SET = {
  kickstarter: {
    TITLE: "Kickstarter Pledges",
    DESCR: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
    END:
      "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json"
  },

  movies: {
    TITLE: "Movies Sales",
    DESCR: "Top 100 Highest Grossing Movies Grouped By Genre",
    END:
      "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json"
  },

  games: {
    TITLE: "Video Game Sales",
    DESCR: "Top 100 Most Sold Video Games Grouped by Platform",
    END:
      "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json"
  }
};

const width = 960,
  height = 580;

const svg = d3
  .select(".container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

makeGraph(DATA_SET.games.END);

function makeGraph(end) {
  d3.json(end).then(data => {
    console.log(data);
    const treemapLayout = d3
      .treemap()
      .size([width, height])
      .paddingOuter(1);

    const root = d3
      .hierarchy(data)
      .eachBefore(d => {
        d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
      })
      .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value);

    treemapLayout(root);

    let cell = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("class", "group")
      .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")");

    let tile = cell
      .append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

    cell
      .append("text")
      .attr("class", "tile-text")
      .selectAll("tspan")
      .data(function(d) {
        return d.data.name.split(/(?=[A-Z][^A-Z])/g);
      })
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", function(d, i) {
        return 13 + i * 10;
      })
      .text(function(d) {
        return d;
      });
  });
}

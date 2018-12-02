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
const body = d3.select("body");
let svg = d3.select("#container");

var tooltip = body
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

let width = +svg.attr("width"),
  height = +svg.attr("height");

const fader = color => d3.interpolateRgb(color, "#fff")(0.2);
const color = d3.scaleOrdinal().range(d3.schemeCategory10.map(fader)),
  format = d3.format(",d");

let treemap = d3
  .treemap()
  .size([width, height])
  .paddingInner(1);

makeGraph(DATA_SET.games.END);

function makeGraph(end) {
  d3.json(end).then(data => {
    d3.selectAll("svg > *").remove();
    let root = d3
      .hierarchy(data)
      .eachBefore(
        d =>
          (d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name)
      )
      .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value);

    treemap(root);

    let cell = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("class", "group")
      .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")");

    let tile = cell
      .append("rect")
      .attr("class", "tile")
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.data.category));

    cell
      .append("text")
      .attr("class", "tile-text")
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 13 + i * 10)
      .text(d => d);

    var categories = root.leaves().map(function(nodes) {
      return nodes.data.category;
    });
    categories = categories.filter(function(category, index, self) {
      return self.indexOf(category) === index;
    });

    var legend = d3.select("#legend");
    var legendWidth = +legend.attr("width");
    const LEGEND_OFFSET = 10;
    const LEGEND_RECT_SIZE = 15;
    const LEGEND_H_SPACING = 150;
    const LEGEND_V_SPACING = 10;
    const LEGEND_TEXT_X_OFFSET = 3;
    const LEGEND_TEXT_Y_OFFSET = -2;
    var legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);

    var legendElem = legend
      .append("g")
      .attr("transform", "translate(60," + LEGEND_OFFSET + ")")
      .selectAll("g")
      .data(categories)
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return (
          "translate(" +
          (i % legendElemsPerRow) * LEGEND_H_SPACING +
          "," +
          (Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
            LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow)) +
          ")"
        );
      });

    legendElem
      .append("rect")
      .attr("width", LEGEND_RECT_SIZE)
      .attr("height", LEGEND_RECT_SIZE)
      .attr("class", "legend-item")
      .attr("fill", function(d) {
        return color(d);
      });

    legendElem
      .append("text")
      .attr("x", LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
      .attr("y", LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
      .text(function(d) {
        return d;
      });
  });
}

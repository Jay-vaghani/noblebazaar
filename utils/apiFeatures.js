class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryString };

    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => {
      delete queryCopy[key];
    });

    let anotherQueryCopy = JSON.parse(
      JSON.stringify(queryCopy)
        .replace(/"gte":/g, '"$gte":')
        .replace(/"lte":/g, '"$lte":')
    );

    this.query = this.query.find({ ...anotherQueryCopy });

    return this;
  }

  pagination(resultPerPage) {
    this.queryString.page = this.queryString.page ? this.queryString.page : 1;

    const skipProduct =
      resultPerPage * Number(this.queryString.page) - resultPerPage;


    this.query = this.query.limit(resultPerPage).skip(skipProduct);

    return this;
  }
}

module.exports = ApiFeatures;

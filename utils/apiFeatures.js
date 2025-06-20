class APIFeatures {
  constructor(query, quryString) {
    this.query = query;
    this.quryString = quryString;
  }

  filter() {
    //1A) Filtering
    const queryObj = { ...this.quryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    //2B) Advanced filtering
    let quryStr = JSON.stringify(queryObj);
    quryStr = quryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(quryStr));
    // let query = Tour.find(JSON.parse(quryStr));

    return this;
  }

  sort() {
    //2) Sorting
    if (this.quryString.sort) {
      const sortBy = this.quryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    //3) Fields
    if (this.quryString.fields) {
      const fields = this.quryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    //4) Pagination
    const page = this.quryString.page * 1 || 1;
    const limit = this.quryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

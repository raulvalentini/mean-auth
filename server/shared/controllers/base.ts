/**
 * Base controller class exposing basic CRUD methods
 */
import logger from '../../core/logger/logger';

abstract class BaseCtrl {

  abstract model: any;

  protected logger = logger.instance;

  /**
   * Get all occurrencies
   */
  getAll = (req, res) => {
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }

  /**
   * Count all occurrencies
   */
  count = (req, res) => {
    this.model.count((err, count) => {
      if (err) { return console.error(err); }
      res.status(200).json(count);
    });
  }

  /**
   * Insert new item into DB
   */
  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, item) => {
      if (err) { return console.error(err); }
      res.sendStatus(200).json(item);
    });
  }


  /**
   * Get item by its ID from DB
   */
  get = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }

  /**
   * Update item into DB
   */
  update = (req, res) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }

  /**
   * Delete item by ID
   */
  delete = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }
}

export default BaseCtrl;

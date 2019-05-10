import * as mongoose from 'mongoose';

/**
 * Profiler class
 */
const profilerSchema = new mongoose.Schema({
  name: String,
  entity: String,
  filter: String,
  builder: String,
  builder_entity: String,
  expire: Number,
  deployed: Boolean,
  deleted: Boolean
});

const Profiler = mongoose.model('Profiler', profilerSchema);

export default Profiler;

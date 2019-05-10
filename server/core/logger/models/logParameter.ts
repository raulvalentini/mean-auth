/**
 * Logger entry parameter class
 */
export default class LogParameter {
  user?: string;
  action?: string;

  constructor(_action?: string, _user?: string) {
    this.user = _user || '';
    this.action = _action || '';
  }
}

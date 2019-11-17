export default class LiveDomSubmissionResult {
  constructor(ok = false, message = '') {
    this.ok = ok;
    this.message = message;
  }
}

export class Message {
  _id: string;
  username: string;
  text: string;
  dateTime: string;

  constructor(_id: string, username: string, text: string, dateTime: string) {
    this._id = _id;
    this.username = username;
    this.text = text;
    this.dateTime = dateTime;
  }

  static fromJSON(json: any): Message {
    return new Message(json._id, json.username, json.text, json.dateTime);
  }

  toJSON(): any {
    return {
      _id: this._id,
      username: this.username,
      text: this.text,
      dateTime: this.dateTime,
    };
  }
}

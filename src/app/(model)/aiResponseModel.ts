export class dreamAnalysis {
  status: string;
  emotion: string;
  category: string;
  analysis: string;
  title: string;
  content: string;
  constructor(
    status = "",
    emotion = "",
    category = "",
    analysis = "",
    title = "",
    content = ""
  ) {
    this.status = status;
    this.emotion = emotion;
    this.category = category;
    this.analysis = analysis;
    this.title = title;
    this.content = content;
  }
}

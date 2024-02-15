import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type imageDocument = HydratedDocument<Image>;

@Schema()
export class Image {
  @Prop({ type: Buffer }) // Sử dụng kiểu dữ liệu Buffer để lưu trữ dữ liệu nhị phân
  data: Buffer;

  @Prop()
  contentType: string; // Loại nội dung của tệp (ví dụ: image/png, image/jpeg, ...)
}

export const ImageSchema = SchemaFactory.createForClass(Image);
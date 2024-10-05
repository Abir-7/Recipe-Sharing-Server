import Contact from "./contactus.interface.model";

export const postMessageIntoDB = async (data: any) => {
  const result = await Contact.create(data);

  return result;
};

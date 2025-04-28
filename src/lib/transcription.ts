const transcription_properties = {
  transcription_epub_link: "epub",
  transcription_pdf_link: "pdf",
  transcription_srt_link: "srt",
  transcription_txt_link: "txt",
};

export function get_transcription_options(baheth_data) {
  const options: string[] = [];

  for (const [key, value] of Object.entries(baheth_data)) {
    if (key in transcription_properties && value) {
      options.push(transcription_properties[key]);
    }
  }

  return options;
}

export function get_url_by_type(baheth_data, type) {
  let url;

  for (const [key, value] of Object.entries(transcription_properties)) {
    if (key in baheth_data && value === type) {
      url = baheth_data[key];
    }
  }

  return url;
}

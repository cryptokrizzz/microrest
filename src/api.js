const createHeaders = (contentType, authorization) => {
  const headers = { 'Content-Type': contentType }
  if (!!authorization) { headers['Authorization'] = authorization; }
  return headers;
}

export const makeRequest = async (path, method, data, authorization, contentType) => {
  const headers = createHeaders(contentType, authorization);
  const request = { method, headers: headers };

  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    request.body = data;
  }

  const resp = await fetch(path, request);
  let type;

  try {
    const text = await resp.text();
    data = text;
    type = 'text';
  }
  catch {
    data = await resp.json();
    type = 'json'
  }

  return { request, response: data, status: resp.status, type }
};
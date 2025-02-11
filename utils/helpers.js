function validateFields(fields) {
    const required = ['caso_id', 'name', 'email', 'type', 'value'];
    const missing = required.filter(field => !fields[field]);

    if (missing.length > 0) {
        throw createError(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    if (!['juridico', 'natural'].includes(fields.type)) {
        throw createError('Invalid entity type', 400);
    }

    if (isNaN(fields.value) || Number(fields.value) <= 0) {
        throw createError('Invalid value amount', 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
        throw createError('Invalid email format', 400);
    }
}

function generateClientFormUrl(fields) {
    const baseUrl = 'https://form.smrabogados.com/cliente';
    const url = new URL(baseUrl);
    url.search = new URLSearchParams({
      caso_id: fields.caso_id,
      name: fields.name,
      type: fields.type,
      value: fields.value
    }).toString();
    return url.toString();
}

function createError(message, status = 500) {
    const error = new Error(message);
    error.status = status;
    return error;
}

module.exports = {validateFields, generateClientFormUrl};
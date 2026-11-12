export default function parseJwt(token) {
  try {
    // Pega a segunda parte do token (o payload)
    const base64Url = token.split('.')[1];
    
    // Substitui caracteres de URL para o formato Base64 padrão
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decodifica e converte para JSON
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null; // Token inválido
  }
}

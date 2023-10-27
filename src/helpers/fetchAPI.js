export const endpoint = 'https://global.cainiao.com/global/detail.json?mailNos=';

export const fetchAPI = async (URL) => {
    const response = await fetch(URL);
    const data = await response.json();
    return data;
};

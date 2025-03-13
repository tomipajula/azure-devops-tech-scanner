/**
 * Muotoilee päivämäärän suomalaiseen muotoon
 * @param {string} dateString - ISO-muotoinen päivämäärä
 * @returns {string} Muotoiltu päivämäärä
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fi-FI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Lyhentää tekstin tiettyyn pituuteen ja lisää ellipsin
 * @param {string} text - Teksti, joka lyhennetään
 * @param {number} maxLength - Maksimipituus
 * @returns {string} Lyhennetty teksti
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Korostaa hakutermi tekstistä
 * @param {string} text - Teksti, josta hakutermi korostetaan
 * @param {string} searchTerm - Hakutermi
 * @returns {JSX.Element} JSX-elementti, jossa hakutermi on korostettu
 */
export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  
  return parts.map((part, index) => 
    part.toLowerCase() === searchTerm.toLowerCase() 
      ? <span key={index} className="search-highlight">{part}</span> 
      : part
  );
};

/**
 * Ryhmittelee teknologiat tyypin mukaan
 * @param {Array} technologies - Teknologiat
 * @returns {Object} Ryhmitellyt teknologiat
 */
export const groupTechnologiesByType = (technologies) => {
  if (!technologies || !technologies.length) return {};
  
  return technologies.reduce((acc, tech) => {
    if (!acc[tech.type]) {
      acc[tech.type] = [];
    }
    acc[tech.type].push(tech);
    return acc;
  }, {});
};

/**
 * Lajittelee teknologiat nimen mukaan
 * @param {Array} technologies - Teknologiat
 * @returns {Array} Lajitellut teknologiat
 */
export const sortTechnologiesByName = (technologies) => {
  if (!technologies || !technologies.length) return [];
  
  return [...technologies].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Hakee uniikit teknologiatyypit
 * @param {Array} technologies - Teknologiat
 * @returns {Array} Uniikit teknologiatyypit
 */
export const getUniqueTechnologyTypes = (technologies) => {
  if (!technologies || !technologies.length) return [];
  
  const types = technologies.map(tech => tech.type);
  return [...new Set(types)];
}; 
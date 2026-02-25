export const filterTickets = (tickets, filters) => {
  const { status, searchTerm } = filters;
  return tickets.filter(t => {
    const matchesStatus = !status || status === 'all' || t.status === status;
    const matchesSearch = !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
};


export const getTicketStats = (tickets) => {
  return {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'pending').length,
    accepted: tickets.filter(t => t.status === 'accepted').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    rejected: tickets.filter(t => t.status === 'rejected').length
  };
};

export const sortTickets = (tickets, sortBy) => {
  const sorted = [...tickets];
  switch (sortBy) {
    case 'latest':
      return sorted.sort((a, b) => {
        const timeA = new Date(a.updated_at || a.created_at).getTime();
        const timeB = new Date(b.updated_at || b.created_at).getTime();
        return timeB - timeA;
      });
    case 'earliest':
      return sorted.sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    case 'status-az':
      return sorted.sort((a, b) =>
        a.status.localeCompare(b.status, 'en', { sensitivity: 'base' }) // ✅ fix
      );
    default:
      return sorted;
  }
};

export const formatDate = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '-';

  const dd   = String(date.getUTCDate()).padStart(2, '0');
  const mm   = String(date.getUTCMonth() + 1).padStart(2, '0');
  const be2  = String(date.getUTCFullYear() + 543).slice(-2); // พ.ศ. 2 หลักท้าย

  const hh   = String(date.getHours()).padStart(2, '0');
  const min  = String(date.getMinutes()).padStart(2, '0');

  return `${dd}/${mm}/${be2} ${hh}:${min}`;
};
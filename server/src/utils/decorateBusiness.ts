export function decorateBusiness(business: any, userId: string) {
  const isLiked = business.likes?.some((id: any) => id.toString() === userId);
  return {
    ...business,
    isLiked,
    likeCount: business.likes?.length || 0,
  };
}

export function decorateBusinesses(businesses: any[], userId: string) {
  return businesses.map((b) => {
    const likeIds = b.likes?.map((id: any) => id.toString()) || [];

    return {
      ...b,
      isLiked: userId ? likeIds.includes(userId.toString()) : false,
      likes: likeIds,
    };
  });
}

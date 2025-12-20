from app.crud.base import CRUDBase
from app.models.quote_post import QuotePost
from app.schemas.quote_post import QuotePostCreate, QuotePostUpdate

class CRUDQuotePost(CRUDBase[QuotePost, QuotePostCreate, QuotePostUpdate]):
    pass

quote_post = CRUDQuotePost(QuotePost)


from app.crud.base import CRUDBase
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate
from sqlalchemy.orm import Session

class CRUDPost(CRUDBase[Post, PostCreate, PostUpdate]):
    def create_with_author(self, db: Session, *, obj_in: PostCreate, author_id: int) -> Post:
        db_obj = Post(**obj_in.dict(), author_id=author_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

post = CRUDPost(Post)

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database.database import Base

class UserModel(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    leetcode_username = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    submissions = relationship("SubmissionModel", back_populates="user")
    user_stats = relationship("UserStatsModel", back_populates="user", uselist=False)

class ProblemModel(Base):
    __tablename__ = "problems"
    
    id = Column(Integer, primary_key=True, index=True)
    leetcode_id = Column(Integer, unique=True, nullable=False)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    difficulty = Column(String, nullable=False)  # Easy, Medium, Hard
    content = Column(Text, nullable=True)
    acceptance_rate = Column(Float, nullable=True)
    is_premium = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    submissions = relationship("SubmissionModel", back_populates="problem")
    tags = relationship("ProblemTagModel", back_populates="problem")

class SubmissionModel(Base):
    __tablename__ = "submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    status = Column(String, nullable=False)  # Accepted, Wrong Answer, etc.
    runtime = Column(String, nullable=True)
    memory = Column(String, nullable=True)
    language = Column(String, nullable=False)
    submitted_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("UserModel", back_populates="submissions")
    problem = relationship("ProblemModel", back_populates="submissions")

class UserStatsModel(Base):
    __tablename__ = "user_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    total_solved = Column(Integer, default=0)
    easy_solved = Column(Integer, default=0)
    medium_solved = Column(Integer, default=0)
    hard_solved = Column(Integer, default=0)
    acceptance_rate = Column(Float, default=0.0)
    ranking = Column(Integer, nullable=True)
    reputation = Column(Integer, default=0)
    last_synced = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("UserModel", back_populates="user_stats")

class TagModel(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    # Relationships
    problems = relationship("ProblemTagModel", back_populates="tag")

class ProblemTagModel(Base):
    __tablename__ = "problem_tags"
    
    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.id"), nullable=False)
    
    # Relationships
    problem = relationship("ProblemModel", back_populates="tags")
    tag = relationship("TagModel", back_populates="problems")
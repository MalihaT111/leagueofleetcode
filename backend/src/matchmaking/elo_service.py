# src/matchmaking/elo_service.py
import math

class EloService:
    # K-factor determines how much ratings change per game
    # Higher K-factor = more volatile ratings
    DEFAULT_K_FACTOR = 32  # Standard for most competitive games
    PROVISIONAL_K_FACTOR = 40  # Higher K for new players (first 30 games)
    EXPERIENCED_K_FACTOR = 16  # Lower K for highly rated players (2400+)
    
    @staticmethod
    def calculate_expected_score(player_rating: int, opponent_rating: int) -> float:
        rating_difference = opponent_rating - player_rating
        expected_score = 1 / (1 + math.pow(10, rating_difference / 400))
        return expected_score
    
    @staticmethod
    def get_k_factor(player_rating: int, games_played: int = None) -> int:
        # Use higher K-factor for provisional players (first 30 games)
        if games_played is not None and games_played < 30:
            return EloService.PROVISIONAL_K_FACTOR
        
        # Use lower K-factor for highly rated players
        if player_rating >= 2400:
            return EloService.EXPERIENCED_K_FACTOR
        
        return EloService.DEFAULT_K_FACTOR
    
    @staticmethod
    def calculate_rating_change(
        player_rating: int, 
        opponent_rating: int, 
        actual_score: float,
        player_games_played: int = None,
        custom_k_factor: int = None
    ) -> int:
        expected_score = EloService.calculate_expected_score(player_rating, opponent_rating)
        
        if custom_k_factor is not None:
            k_factor = custom_k_factor
        else:
            k_factor = EloService.get_k_factor(player_rating, player_games_played)
        
        rating_change = k_factor * (actual_score - expected_score)
        return round(rating_change)
    
    @staticmethod
    def calculate_match_rating_changes(
        winner_rating: int,
        loser_rating: int,
        winner_games_played: int = None,
        loser_games_played: int = None,
        is_resignation: bool = False
    ) -> tuple[int, int]:
        # For resignations, we might want to apply a slight penalty
        # but still use the standard Elo calculation
        winner_score = 1.0
        loser_score = 0.0
        
        # Calculate rating changes
        winner_change = EloService.calculate_rating_change(
            winner_rating, loser_rating, winner_score, winner_games_played
        )
        loser_change = EloService.calculate_rating_change(
            loser_rating, winner_rating, loser_score, loser_games_played
        )
        
        # For resignations, apply a small additional penalty to the loser
        if is_resignation:
            loser_change -= 2  # Small additional penalty for giving up
        
        return winner_change, loser_change
    
    @staticmethod
    def get_rating_change_preview(
        player_rating: int,
        opponent_rating: int,
        player_games_played: int = None
    ) -> dict:
        expected_score = EloService.calculate_expected_score(player_rating, opponent_rating)
        
        win_change = EloService.calculate_rating_change(
            player_rating, opponent_rating, 1.0, player_games_played
        )
        loss_change = EloService.calculate_rating_change(
            player_rating, opponent_rating, 0.0, player_games_played
        )
        
        return {
            "win_probability": round(expected_score * 100, 1),
            "rating_change_on_win": win_change,
            "rating_change_on_loss": loss_change,
            "expected_score": expected_score
        }
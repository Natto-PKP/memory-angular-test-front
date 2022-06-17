import { Component, OnInit } from '@angular/core';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss'],
})
export class MemoryComponent implements OnInit {
  error: string | null = null;

  cards: { value: string; x: number; y: number; flip: boolean }[][] = [];
  couple: { x: number; y: number }[] = [];
  end = false;
  history: { x: number; y: number; action: 'flip' | 'reverse' }[] = [];
  moves = 0;
  pause = true;
  time = 0;
  timer: any | null = null;
  size: number = 4;

  constructor(private board: BoardService) {}

  ngOnInit(): void {
    this.startGame();
  }

  /**
   * Add cards to the game board
   */
  buildBoard() {
    this.board.getCards(this.size).subscribe({
      next: (emojis) => {
        this.cards = [];

        for (let i = 0, y = 0; i < emojis.length; i += 1) {
          if (!this.cards[y]) this.cards.push([]);
          if (i && i % this.size === 0) {
            this.cards.push([]);
            y += 1;
          }
          this.cards[y].push({
            value: emojis[i],
            x: i % this.size,
            y,
            flip: false,
          });
        }
      },
      error: () => (this.error = 'Login first'),
    });
  }

  /**
   * Clear all game properties
   */
  clearGame() {
    this.cards = [];
    this.couple = [];
    this.end = false;
    this.history = [];
    this.moves = 0;
    this.pause = true;
    this.time = 0;
    this.size = 4;
  }

  /**
   * Handle card click
   * @param y
   * @param x
   * @returns
   */
  handleCardClick(y: number, x: number) {
    const card = this.cards[y][x];
    if (card.flip || this.couple.length >= 2 || this.end) return;

    card.flip = true;

    const gameBoard = document.getElementById('game-board') as HTMLElement;
    const element = gameBoard.children[y].children[x];
    element.classList.add('game__board__card--active');
    element.innerHTML = card.value;

    this.history.push({ x, y, action: 'flip' });
    this.couple.push({ x, y });

    if (this.couple.length === 2) {
      const [a, b] = this.couple;
      this.moves += 1;

      if (this.cards[a.y][a.x].value === this.cards[b.y][b.x].value) {
        const finish = this.cards.every((row) => row.every(({ flip }) => flip));
        if (finish) this.stopGame();
        else {
          new Promise((resolve) => setTimeout(resolve, 800)).then(
            () => (this.couple = [])
          );
        }
      } else {
        this.couple.forEach((cpl) => {
          const cardCpl = this.cards[cpl.y][cpl.x];
          const element = gameBoard.children[cpl.y].children[cpl.x];

          new Promise((resolve) => setTimeout(resolve, 400)).then(() => {
            cardCpl.flip = false;
            element.classList.remove('game__board__card--active');
            element.innerHTML = '';
            this.couple = [];
            this.history.push({ x, y, action: 'reverse' });
          });
        });
      }
    }
  }

  handleRestartClick() {
    if (!this.end) return;
    this.clearGame();
    this.startGame();
  }

  async handleReviewClick() {
    const gameBoard = document.getElementById('game-board') as HTMLElement;
    if (!this.end || !gameBoard) return;

    for (let y = 0; y < gameBoard.children.length; y += 1) {
      for (let x = 0; x < gameBoard.children[y].children.length; x += 1) {
        const element = gameBoard.children[y].children[x];
        element.innerHTML = '';
        element.classList.remove('game__board__card--active');
      }
    }

    for await (const { x, y, action } of this.history) {
      const element = gameBoard.children[y].children[x];
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (action === 'reverse') {
        element.innerHTML = '';
        element.classList.remove('game__board__card--active');
      } else if (action === 'flip') {
        element.innerHTML = this.cards[y][x].value;
        element.classList.add('game__board__card--active');
      }
    }
  }

  handleSendResultClick() {
    this.board.postScore({ time: this.time, moves: this.moves }).subscribe({
      next: () => alert('Result sent'),
      error: () => (this.error = 'Send error'),
    });
  }

  /**
   * Cancel actual try
   * @returns
   */
  handleUndoClick() {
    const gameBoard = document.getElementById('game-board') as HTMLElement;
    if (this.end || !gameBoard || this.couple.length !== 1) return;
    const { x, y } = this.couple[0];
    const card = this.cards[y][x];
    const element = gameBoard.children[y].children[x];

    card.flip = false;
    element.classList.remove('game__board__card--active');
    element.innerHTML = '';
    this.couple = [];
    this.history.push({ x, y, action: 'reverse' });
  }

  startGame() {
    this.buildBoard();
    this.pause = false;
    this.startTimer();
  }

  startTimer() {
    const now = Date.now();
    this.timer = setInterval(() => (this.time = Date.now() - now), 75);
  }

  stopGame() {
    this.end = true;
    this.stopTimer();
  }

  stopTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}

const board = document.querySelector(".board");
let tablica = [];
let liczby = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Inicjalizacja planszy
for (let row = 0; row < 9; row++) {
    tablica[row] = [];
    for (let col = 0; col < 9; col++) {
        const pole = document.createElement("div");
        pole.classList.add("pole");
        pole.dataset.row = row;
        pole.dataset.col = col;
        board.appendChild(pole);
        tablica[row][col] = pole;
    }
}

// Funkcja generująca pełną planszę
function generowanie() {
    if (fillBoard()) {
        console.log("Plansza została wygenerowana!");
        usuwanie(40);
    } else {
        console.error("Nie udało się wygenerować planszy!");
    }
}

// Funkcja rekurencyjna do wypełniania planszy
function fillBoard() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (tablica[row][col].textContent === "") {
                // Szukamy pustego pola
                let liczby = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                shuffle(liczby); // Mieszamy liczby, by wstawiać je losowo

                for (let i = 0; i < 9; i++) {
                    if (czyPasuje(row, col, liczby[i])) {
                        tablica[row][col].textContent = liczby[i]; // Ustawiamy liczbę w polu

                        // Rekurencyjnie próbujemy wypełnić resztę planszy
                        if (fillBoard()) {
                            return true; // Jeśli udało się, kontynuujemy
                        }

                        // Jeśli nie udało się, cofacie zmianę i próbujemy następną liczbę
                        tablica[row][col].textContent = "";
                    }
                }

                return false; // Jeśli żadna liczba nie pasuje, wracamy do poprzedniego pola
            }
        }
    }

    return true; // Jeśli wszystkie pola zostały wypełnione
}

// Funkcja sprawdzająca, czy liczba pasuje
function czyPasuje(row, col, losowa) {
    // Sprawdzamy wiersz
    console.log(row, col, losowa, typeof row, typeof col, typeof losowa);

    for (let i = 0; i < 9; i++) {
        if (losowa == parseInt(tablica[row][i].textContent)) {
            console.log("nie dziala kolumna" + row + i);
            return false;
        }
    }

    // Sprawdzamy kolumnę
    for (let i = 0; i < 9; i++) {
        if (losowa == parseInt(tablica[i][col].textContent)) {
            console.log("nie dziala wiersz");
            return false;
        }
    }

    // Sprawdzamy 3x3 pole
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (tablica[startRow + i][startCol + j].textContent == losowa) {
                console.log("nie dziala 3x3");
                return false;
            }
        }
    }

    console.log("dizala funkcja");

    return true;
}

// Funkcja do przetasowania tablicy (Fisher-Yates shuffle)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Funkcja do usuwania liczb z planszy
function usuwanie(liczbaPol) {
    let polUsunietych = 0;
    while (polUsunietych < liczbaPol) {
        // Losowanie pozycji
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        // Sprawdzamy, czy pole już jest puste
        if (tablica[row][col].textContent !== "") {
            const temp = tablica[row][col].textContent;
            tablica[row][col].textContent = ""; // Usuwamy liczbę

            // Sprawdzamy, czy plansza nadal ma jedno rozwiązanie
            if (maJednoRozwiazanie()) {
                polUsunietych++;
                tablica[row][col].addEventListener("click", wybieraniePola);
            } else {
                // Przywracamy liczbę, jeśli ma więcej niż jedno rozwiązanie
                tablica[row][col].textContent = temp;
            }
        }
    }

    console.log(`Usunięto ${liczbaPol} pól.`);
}

// Funkcja sprawdzająca, czy plansza ma tylko jedno rozwiązanie
function maJednoRozwiazanie() {
    let liczbaRozwiazan = 0;

    // Prosty algorytm backtrackingu do liczenia rozwiązań
    function countSolutions(row, col) {
        if (row === 9) {
            liczbaRozwiazan++;
            return;
        }

        if (col === 9) {
            countSolutions(row + 1, 0);
            return;
        }

        if (tablica[row][col].textContent === "") {
            for (let num = 1; num <= 9; num++) {
                if (czyPasuje(row, col, num)) {
                    tablica[row][col].textContent = num;
                    countSolutions(row, col + 1);
                    tablica[row][col].textContent = "";
                }
            }
        } else {
            countSolutions(row, col + 1);
        }
    }

    countSolutions(0, 0);
    return liczbaRozwiazan === 1; // Sprawdzamy, czy jest dokładnie jedno rozwiązanie
}

let wybranePole = null;
function wybieraniePola(event) {
    const czerwoneDivy = Array.from(
        document.querySelectorAll(".board div")
    ).filter((div) => {
        const kolor = getComputedStyle(div).backgroundColor;
        return kolor != "#222" && kolor != "rgb(255, 0, 0)";
    });
    czerwoneDivy.forEach((czerDiv) => {
        czerDiv.style.backgroundColor = "#222";
    });

    let okno = event.target;
    okno.style.backgroundColor = "#77f";
    wybranePole = okno;
}

let guziki = document.querySelectorAll("button");

function czyPasujeRozwiazanie(row, col, losowa) {
    // Sprawdzamy wiersz
    for (let i = 0; i < 9; i++) {
        if (i == col) {
            continue;
        } else if (losowa == parseInt(tablica[row][i].textContent)) {
            return false;
        }
    }

    // Sprawdzamy kolumnę
    for (let i = 0; i < 9; i++) {
        if (i == row) {
            continue;
        } else if (losowa == parseInt(tablica[i][col].textContent)) {
            return false;
        }
    }

    // Sprawdzamy 3x3 pole
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let currentRow = startRow + i;
            let currentCol = startCol + j;
            if (currentRow == row && currentCol == col) {
                continue;
            } else if (tablica[startRow + i][startCol + j].textContent == losowa) {
                return false;
            }
        }
    }

    console.log("dizala funkcja");

    return true;
}

function wpisywanieCyfr(event) {
    wybranePole.textContent = event.target.value;

    if (czyPasujeRozwiazanie(parseInt(wybranePole.dataset.row), parseInt(wybranePole.dataset.col), parseInt(event.target.value))) {
        wybranePole.removeEventListener("click", wybieraniePola);
        wybranePole.style.backgroundColor = "green";
        
        setTimeout(() => {
            wybranePole.style.backgroundColor = "#222";
            wybranePole.style.color = "blue";
        }, 1500);

        let wszystkieWypelnione = true;
        for (let row of tablica) {
            for (let pole of row) {
                if (!liczby.includes(parseInt(pole.textContent))) {
                    wszystkieWypelnione = false;
                    break;
                }
            }
            if (!wszystkieWypelnione) break;
        }

        if (wszystkieWypelnione) {
            let wygrana = document.createElement("p");
            wygrana.textContent = "Wygrałeś!";
            document.body.appendChild(wygrana);
        }
    } else {
        wybranePole.style.backgroundColor = "#f00";
    }
}

guziki.forEach((przyciski) => {
    przyciski.addEventListener("click", wpisywanieCyfr);
});

generowanie();

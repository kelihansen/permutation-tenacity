/* eslint no-console:off */

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

// Marty imperative
function getPermImp(n) {
    return recurse(alphabet.slice(0, n));

    function recurse(letters) {
        let results = [];
        for(let i = 0; i < letters.length; i++) {
            const letter = letters[i];
            const remaining = letters.slice();
            remaining.splice(i, 1);
            if(remaining.length === 1) {
                results.push(letter + remaining[0]);
            }
            else {
                const perms = recurse(remaining)
                    .map(s => letter + s);
                results = results.concat(perms);
            }
        }
        return results;
    }
}

console.time();
console.log('Marty imperative:', getPermImp(5));
console.timeEnd();
// when n = 10, takes about 8 seconds
// when n = 11 "paused before potential out-of-memory crash"


// Marty declarative
function getPermDec(n) {
    return recurse(alphabet.slice(0, n));

    function recurse(letters){
        if(letters.length === 1) return letters;

        return letters.reduce((sets, letter, i) => {
            const remaining = letters.slice();
            remaining.splice(i, 1);
            const permutations = recurse(remaining).map(p => letter + p);
            sets.push(...permutations);
            return sets;
        }, []);
    }
}

console.time();
console.log('Marty declarative:', getPermDec(5));
console.timeEnd();
// zippy up to n = 9
// when n = 10 "maximum call stack size exceeded"

/* 

Now that I got Marty's to work, how does it work?

say we call getPermDec(3)
in the end, we'll return the results of running recurse([a, b, c])

we can bypass the "if" clause and move onto the reduce
here we start with an empty array as the accumulator
and we begin with "a" as our letter
"remaining" becomes [b, c]
and now we run recurse([b, c])

    "b" is our letter
    remaining becomes [c]
    and we run recurse([c])
        now we return [c]
    to the function where "b" is the letter
    we map [c], prepending "b" to its single element, making "permutations" [bc]
    and we push that into sets, which becomes the next accumulator

    now "c" is our letter
    with [bc] as our accumulator
    remaining becomes [b]
    and we run recurse([b])
        now we return [b]
    to the function where "c" is the letter
    we map [b], prepending "c" to its single element, making "permutations" [cb]
    and we push that into sets, which is now [bc, cb] and gets returned to where it was called, while we were assigning a value to "permutations" in the function where the letter is "a"

now we take "a" and prepend it to each element in the array just returned, giving us [abc, acb]
we push those elements into this function's "sets", which becomes the next accumulator

now "b" is our letter
"remaining" becomes [a, c]
and we run recurse on that

    "a" is our letter
    remaining becomes [c]
    and we run recurse([c])
        now we return [c]
    to the function where "a" is the letter
    we map [c], prepending "a" to its single element, making "permutations" [ac]
    and we push that into sets, which becomes the next accumulator

    now "c" is our letter
    with [ac] as our accumulator
    remaining becomes [a]
    and we run recurse([a])
        now we return [a]
    to the function where "c" is the letter
    we map [a], prepending c to its single element, making "permutations" [ca]
    and we push that into sets, which is now [ac, ca] and gets returned to where it was called, while we were assigning a value to "permutations" in the function where the letter is "b"

now we take "b" and prepend it to each element in the array just returned, giving us [bac, bca]
we push those elements into this function's "sets", which becomes the next accumulator as [abc, acb, bac, bca]

now "c" is our letter
"remaining" becomes [a, b]
and we run recurse on that

    "a" is our letter
    remaining become [b]
    and we run recurse([b])
        now we return [b]
    to the function where "a" is the letter
    we map [b], prepending a its single element, making "permutations" [ab]
    and we push that into sets, which becomes the next accumulator

    now "b" is our letter
    with [ab] as our accumulator
    remaining becomes [a]
    and we run recurse([a])
        now we return [a]
    to the function where "b" is the letter
    we map [a], prepending b to its single element, making "permutations" [ba]
    and we push that into sets, which is now [ab, ba] and gets returned to where it was called, as we were assigning a value to "permutations" in the function where the letter is "c"

now we take "c" and prepend it to each element in the array just returned, giving us [cab, cba]
we push those elements into this function's "sets", which gets returned from the function as [abc, acb, bac, bca, cab, cba]!

*/

// Keli with Heap's algorithm
function getPermutations(integer) {
    const result = [];
    if(integer < 1) return result;

    const letterArray = alphabet.slice(0, integer);
    const endIndex = integer - 1;

    function swap(array, index1, index2) {
        [array[index1], array[index2]] = [array[index2], array[index1]];
    }

    recurse(endIndex, letterArray);
    return result;

    function recurse(end, letters) {
        if(!end) return result.push(letters.join(''));
        for(let i = 0; i < end; i++) {
            recurse(end - 1, letters);
            end % 2 ? swap(letters, i, end) : swap(letters, 0, end);
        }
        recurse(end - 1, letters);
    }
}

console.time();
console.log('Keli with Heap\'s:', getPermutations(5));
console.timeEnd();
// when integer = 10, takes about 4 seconds
// when integer = 11, takes about a minute

/* 

Heap's algorithm, step by step

function(n,  array) {
    to kick things off, n should equal the length of the array minus 1 (i.e. the index of the last element)
    1) if n is 0, join & console.log the array
    2) otherwise, step through the array until i (which starts as 0) equals n
        a) inside this loop, start by running THIS VERY FUNCTION with n - 1 as the first argument
        b) if n is odd, swap the value at i with the value at index n
        c) if n is even, swap the first value with the value at index n
    3) after exiting the loop, call our handy recursive function one last time with n - 1 as the first argument
}

function(n = 3, array = [a, b, c, d]);

n isn't 0, so move on
step through the array until i equals n
    start by running THIS VERY FUNCTION with n - 1 as the first argument
    so call function(n = 2, array = [a, b, c, d]) {
        which has us step through the array until i equals n {
            starting by running this same function with n - 1 as the first argument
            so call function(n = 1, array = [a, b, c, d]) {
                which has us step through the array until i equals n {
                    starting by running this same function with n - 1 as the first argument
                    so call function(n = 0, array = [a, b, c, d]) {
                        which starts by telling us if n is 0, end the function by outputting the array
                    }
                    hooray, a result: in our console, we should see 'abcd'
                at this point, we're back in a loop where n = 1 and i = 0
                n is odd, so our swap results in [b, a, c, d], and we move on to i = 1
                except now i = n, so we're done with the loop    
                }
            we've done a swap, but we haven't logged it - let's finish by calling our recursive function once more with n - 1 as the first argument
            recall that n equals 1, so call function(n = 0, array = [b, a, c, d])
            because n is 0, this just logs 'bacd'
            functions complete!
            }
        now we're back in a loop where n = 2 and i = 0
        n is even, so our swap results in [c, a, b, d], and we move on to i = 1
            call function(n = 1, array = [c, a, b, d]) {
                which has us step through the array until i equals n {
                    starting by running this same function with n - 1 as the first argument
                    so call function(n = 0, array = [c, a, b, d]) {
                        because n is 0, this just logs 'cabd'
                we're back in a loop where n = 1 and i = 0
                n is odd, so our swap results in [a, c, b, d], and we move on to i = 1
                except now i = n, so we're done with the loop    
                }
            we finish by calling our recursive function once more with n - 1 as the first argument
            n still equals 1, so call function(n = 0, array = [a, c, b, d])
                because n is 0, this just logs 'acbd'
            functions complete!
            }
        now we're back in a loop where n = 2 and i = 1
        n is even, so our swap results in [b, c, a, d], and we move on to i = 2
        except now i = n, so we're done with the loop
        }
    we finish by calling our recursive function once more with n - 1 as the first argument
    here n = 2, so call function(n = 1, array = [b, c, a, d]) {
        which has us step through the array until i equals n {
            starting by running this same function with n - 1 as the first argument
            so call function(n = 0, array = [b, c, a, d]) {
                because n is 0, this just logs 'bcad'
        at this point, we're back in a loop where n = 1 and i = 0
        n is odd, so our swap results in [c, b, a, d], and we move on to i = 1
        except now i = n, so we're done with the loop    
        }
    we finish by calling our recursive function once more with n - 1 as the first argument
    n still equals 1, so call function(n = 0, array = [c, b, a, d])
        because n is 0, this just logs 'cbad'
    more functions are complete, plus we've printed all the permutations ending in "d"
    }
NOW we're back in our outer loop where n = 3 and i = 0
time to swap out our last element: [d, b, a, c]
and we do the whole thing again with i = 1!
.
.
.

*/

ascii firstNumber="enter first number:"
ascii secondNumber="enter second number:"


start:
mov [!firstNumber],DATA
int 0x0
int 0x3
mov DATA,R1
mov [!secondNumber],DATA
int 0x0
int 0x3
mov DATA,R2
cal &[!pgcd]
hlt

pgcd:
; the two numbers are in R1 and R2
mov R1,acc
jgt R2,&[!first]
jlt R2,&[!second]
; if R1 == R2
jmp &[!end]

first:
; if R2 > R1
sub R2,acc
mov acc,R2
jmp &[!pgcd]

second:
; if R1 > R2
sub acc,R2
mov acc,R1
jmp &[!pgcd]


end:
mov R1,DATA
ret


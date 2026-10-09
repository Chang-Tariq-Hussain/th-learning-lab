"""Independent re-computation of every numeric / logic General Abilities item in Mock 1."""
import itertools, math
from fractions import Fraction as F
ok=[]
def chk(name,cond):
    assert cond, name; ok.append(name)
# arithmetic / algebra
chk('GA1', 4**0.5*4**2-4**0==31)
chk('GA2', abs(27**(2/3)-9)<1e-9)
chk('GA3 watchmaker', 420/0.6==700)
chk('GA4 scholarship', 40000*0.2==8000 and 100-15-45==40)
chk('GA5 ratio', 9*1050/14==675)
chk('GA6 add x', F(7+5,13+5)==F(2,3))
A=(112+36)/4; B=A-12; C=2*B
chk('GA7 share', (A,B,C)==(37,25,50) and A+B+C==112)
P=815-3*(854-815); chk('GA8 SI', P==698)
chk('GA9 avg', sum([3,4,4,5,6,8])/6==5)
chk('GA10 squares', 7**2+8**2==113==120-7)
chk('GA11 markers', 5*34+(245-170)==245 and 3*34+3*(245-170)==327)
x=(16.36-6)/7; chk('GA12 baker', round(x,2)==1.48)
z=5; chk('GA13 Zaid', 6*z+7+z+7==49 and 6*z-z==25)
k=2; chk('GA14 Babar', (6*k+10)*10==(5*k+10)*11 and 5*k+6==16)
chk('GA15 Ali/Asim', 40+10==5*10)
chk('GA16 man/son', (5*6-4)*(6-4)==52 and 5*6==30)
chk('GA17 sq', (4**2)+8*4-5==(4+4)**2-21)
chk('GA18 ineq', [n for n in range(-10,10) if -7<4*n<=8]==[-1,0,1,2])
chk('GA19 order', sorted([('i',.25),('ii',.5),('iii',.125),('iv',.5**(1/3))],key=lambda t:t[1])[0][0]=='iii' and [t[0] for t in sorted([('i',.25),('ii',.5),('iii',.125),('iv',.5**(1/3))],key=lambda t:t[1])]==['iii','i','ii','iv'])
a=(41400000+240*2500)/21000; chk('GA20 tickets', a==2000)
chk('GA21 museum', (5*450+25*120)/30==175)
chk('GA22 sets', 200-(90+108-46)==48)
chk('GA23 prob', F(7,21)==F(1,3))
chk('GA24 bikes', 27+21-29==19)
chk('GA25 train', (99+231)/11*3.6==108)
chk('GA26 race', 100-36/45*100==20)
cows=160; chk('GA27 cows', 150*cows==160*(cows-10))
w=80; chk('GA28 workers', 30*w==40*(w-20))
# 16m+12w in 20d ; 18w in 40d => work=720 wd ; m=1.5w
m=1.5; chk('GA29 men/women', 720/(12*m+27)==16 and (16*m+12)*20==720)
chk('GA30 semicircle', abs((math.pi+2)*4-20.6)<0.1)
chk('GA31 track', 440/(2*math.pi)>69.9 and round(440/(2*22/7))==70 and 70+14==84)
chk('GA32 cylinder', round(2*22/7*3.5*(3.5+5.5),1)==198)
chk('GA33 ext angle', 20+60==80 and 20*3==60)
chk('GA34 profit', (1500-1250)/1250==0.2)
chk('GA35 discount', 2000*.85*.90==1530)
chk('GA36 work', F(1,12)+F(1,18)==F(5,36) and float(F(36,5))==7.2)
chk('GA37 avg removed', 5*27-4*25==35)
chk('GA38 mixture', 20/0.8-20==5)
chk('GA39 pct', (150-120)/120==0.25)
# series / coding
chk('GA40 series', [b-a for a,b in zip([3,6,11,18,27],[6,11,18,27,38])]==[3,5,7,9,11])
shift=lambda s,n:''.join(chr((ord(c)-65+n)%26+65) for c in s)
chk('GA41 coding', shift('MARCH',2)=='OCTEJ' and shift('APRIL',2)=='CRTKN')
chk('GA42 letters', chr(65+16-5)=='L' and ord('Z')-ord('X')==2 and ord('X')-ord('U')==3 and ord('U')-ord('Q')==4)
# reasoning
t=8*60+15-52; chk('GA44 bus2', divmod(t+16,60)==(7,39))
chk('GA45 seq', [15,13,9,3,-5,-15,-27]==[15,13,9,3,-5,-15,-27] and 15-13==2 and 13-9==4 and 9-3==6 and 3+5==8 and -5+15==10 and -15+27==12)
chk('GA46 dict', sorted(['Apparent','Apostate','Appoint','Apparel'])==['Apostate','Apparel','Apparent','Appoint'])
sums=set()
for r in range(1,5):
    for c in itertools.combinations([20,30,50,70],r): sums.add(sum(c))
chk('GA48 weights', 160 not in sums and 170 in sums and 150 in sums)
d='5109238674'; L=list(d)
for i in range(5): L[i],L[i+5]=L[i+5],L[i]
chk('GA49 digits', L[-3]=='0')
# arrangement puzzle (Q115): G,H,J,K,L,M
subs='GHJKLM'; res=set()
for p in itertools.permutations(subs):
    pos={s:i+1 for i,s in enumerate(p)}
    if pos['G']!=pos['H']+1: continue
    if not pos['K']<pos['G']: continue
    if not pos['M']<pos['L']: continue
    if abs(pos['M']-pos['J'])!=1: continue
    if pos['L']<pos['K']: res.add(pos['H'])
print('Q115 possible H positions when L before K:',res)
chk('GA43 arrangement', len(res)==1)
# Saleem
x=y=0; x-=5; y+=5; x+=20; y-=5; chk('GA50 Saleem', math.hypot(x,y)==15)
print(len(ok),'checks passed')

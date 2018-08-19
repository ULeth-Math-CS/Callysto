---
author:
- Sean Fitzpatrick
title: |
    Math 2580 Assignment \#2\
    University of Lethbridge, Spring 2016
---

\maketitle
**Due date:** Thursday, January 28, by 3 pm.

\bigskip
Please provide solutions to the problems below, using the following
guidelines:

-   Your submitted assignment should be a **good copy** -- figure out
    the problems first, and then write down organized solutions to each
    problem.

-   You should include a **cover page** with the following information:
    the course number and title, the assignment number, your name, and a
    list of any resources you used or people you worked with.

-   Since you have plenty of time to work on the problems, assignment
    solutions will be held to a higher standard than on a test. Your
    explanations should be clear enough that any of your classmates can
    understand your solutions.

-   Group work is permitted, but copying is not. If you're not sure what
    the difference is, feel free to ask. If you get help solving a
    problem, you should (a) make sure you completely understand the
    solution, and (b) re-write the solution for your good copy by
    yourself, in your own words.

-   Assignments can be submitted in class, or in the designated drop box
    on the 5th floor of University Hall, across from the Math Department
    office.

-   Late assignments will not be accepted without prior permission.

\newpage
Terminology {#terminology .unnumbered .unnumbered}
-----------

With functions of several variables there is a hierarchy of
"well-behavedness". For a function $f:\mathbb{R}^n\to\mathbb{R}^m$,
continuity is defined as usual
($\lim_{\mathbf{x}\to\mathbf{a}}f(\mathbf{x})=f(\mathbf{a})$). In class,
we defined what it means for a function to be differentiable in terms of
the existence of a linear approximation.

The desired linear approximation at a point $\mathbf{a}\in\mathbb{R}^n$
is given by
$L_{\mathbf{a}}(\mathbf{x}) = A(\mathbf{x}-\mathbf{a})+\mathbf{b}$,
where $\mathbf{b}$ is a constant vector (point) in $\mathbb{R}^m$, and
$A$ is an $m\times n$ matrix, called the **Jacobian matrix** of $f$ at
$\mathbf{a}$. The Jacobian matrix is often viewed as "the" derivative in
higher dimensions, and it is denoted by
$$A = D_{\mathbf{a}}f \quad \text{ or } \quad A = \frac{\partial(f_1,\ldots, f_m)}{\partial (x_1,\ldots, x_n)}.$$
The Jacobian matrix is an $m\times n$ matrix defined as follows: If
$f=(f_1,\ldots, f_m)$, where each $f_i$ is a real-valued function of
$x_1,\ldots, x_n$, then $$D_{\mathbf{a}}f = \begin{bmatrix}
                    \dfrac{\partial f_1}{\partial x_1}(\mathbf{a}) & \dfrac{\partial f_1}{\partial x_2}(\mathbf{a}) & \cdots & \dfrac{\partial f_1}{\partial x_n}(\mathbf{a})\\
 & & & \\
                    \dfrac{\partial f_2}{\partial x_1}(\mathbf{a}) & \dfrac{\partial f_2}{\partial x_2}(\mathbf{a}) & \cdots & \dfrac{\partial f_2}{\partial x_n}(\mathbf{a})\\
 & & & \\
 \vdots & \vdots & \ddots & \vdots \\

 & & & \\
                    \dfrac{\partial f_m}{\partial x_1}(\mathbf{a}) & \dfrac{\partial f_m}{\partial x_2}(\mathbf{a}) & \cdots & \dfrac{\partial f_m}{\partial x_n}(\mathbf{a})\\
                   \end{bmatrix}$$ Our funtion $f$ is then
**differentiable** at $\mathbf{a}$ if
$$\lim_{\mathbf{x}\to\mathbf{a}}\frac{\lVert f(\mathbf{x}) - L_{\mathbf{a}}(\mathbf{x})\rVert}{\lVert \mathbf{x}-\mathbf{a}\rVert} = 0,$$
which means that the difference between $f$ and the linear approximation
shrinks to zero as $\mathbf{x}$ approaches $\mathbf{a}$ (and that it
does so faster than the difference between $\mathbf{x}$ and
$\mathbf{a}$).

The following are true (see the handout on differentiability that I
posted):

-   If $f$ is differentiable at $\mathbf{a}$, then $f$ is continuous at
    $\mathbf{a}$.

-   If $f$ is differentiable at $\mathbf{a}$, then all partial
    derivatives of $f$ exist at $\mathbf{a}$.

Note however that if $f$ is not differentiable, $f$ might still be
continuous, and $f$ might have partial derivatives, but neither of these
properties implies the other. Now, while mere existence of partial
derivatives at a point doesn't tell us much (it doesn't even guarantee
continuity of $f$), it turns out that requiring the partial derivatives
to be *continuous* is a much stronger requirement.

\pagebreak
We say that a function $f:D\subseteq \mathbb{R}^n\to \mathbb{R}^m$ is
**continuously differentiable** at $\mathbf{a}$ if all partial
derivatives of $f$ exist **and** are continuous on an open
neighbourhood[^1] of $\mathbf{a}$.

\medskip
It is then a theorem (I'll post a proof on Moodle) that any continuously
differentiable function is differentiable. So, while mere existence of
partial derivatives is not enough to guarantee a good linear
approximation, continuity of those partial derivatives is.

Continuously differentiable functions are sometimes referred to as $C^1$
functions, for brevity. This notation is part of a collection: a $C^0$
function is a function which is simply continuous. A $C^2$ function is
one whose *second-order* partial derivatives exist and are continuous, a
$C^3$ function has continuous third-order partial derivatives, and so
on.

Assigned problems {#assigned-problems .unnumbered .unnumbered}
-----------------

1.  Let $r:\mathbb{R}\to \mathbb{R}^3$ be a smooth[^2] curve given by
    $r(t)=(u(t),v(t),w(t))$, and let $f:\mathbb{R}^3\to\mathbb{R}^3$ be
    a continuously differentiable function given by
    $$f(u,v,w) = (x(u,v,w), y(u,v,w), z(u,v,w)).$$ The composition
    $s(t) = (f\circ r) (t) = (x(r(t)), y(r(t)), z(r(t)))$ is then
    another curve in $\mathbb{R}^3$. Using the Chain Rule, show the
    following:

    1.  If $r'(t)$ exists for all $t$, then $s'(t)$ exists for all $t$.

    2.  If $\vec{v}$ is tangent to the curve $r(t)$ at a point
        $\mathbf{u}_0=(u_0,v_0,w_0) = r(t_0)$, then
        $D_{\mathbf{u}_0}f\vec{v}$ is tangent to the curve $s(t)$ at the
        point $\mathbf{x_0} = f(u_0,v_0,w_0) = s(t_0)$.

        (Hint: If $\vec{v}$ is tangent to the curve $r(t)$ at $r(t_0)$,
        then it must be a scalar multiple of $r'(t_0)$.)

    3.  **Bonus:** In order to say that the curve $s(t)$ is "smooth", we
        would need to also guarantee that $s'(t)$ is never zero. What
        condition on $D_{\mathbf{x}}f$ will guarantee this? (Hint: if
        $\vec{v}$ is a non-zero vector, how can you guarantee that
        $A\vec{v}\neq 0$ for an $m\times n$ matrix $A$?)

2.  Let $r(t)=(2\cos(t), 3\sin(t))$ be a curve in the plane, and let
    $f:\mathbb{R}^2\to \mathbb{R}$ be the function $f(x,y) = x^2-4xy^3$.
    The curve $$s(t) = (2\cos(t),3\sin(t), f(2\cos(t),3\sin(t)))$$ is
    then a curve in $\mathbb{R}^3$ that lies on the surface $z=f(x,y)$.

    1.  Explain why the claim above (that $s(t)$ defines a curve on the
        surface $z=f(x,y)$) is true.

    2.  Show that the tangent vector to $s(t)$ when $t=0$ lies in the
        tangent plane to the surface $z=f(x,y)$ at the point $(2,0,4)$.

    Note: the general case for this example is at the end of Section
    15.3 in the Marsden and Weinstein text.

[^1]: An **open neighbourhood** of a point $\mathbf{a}\in\mathbb{R}^n$
    is a set of the form
    $N_r(\mathbf{a}) = \{\mathbf{x}\in\mathbb{R}^n | \lVert\mathbf{x}-\mathbf{a}\rVert<r\}$.

[^2]: For us, a curve will be *smooth* if
    $r'(t)=\langle u'(t), v'(t), w'(t)\rangle$ exists and is
    **non-zero** for all $t$.
